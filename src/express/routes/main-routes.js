"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const isGuest = require(`../middlewares/is-guest`);
const {prepareErrors, getHotArticles} = require(`../../utils`);
const {USER_INTERFACE_SETTINGS} = require(`../../constants`);
const csrf = require(`csurf`);

const mainRouter = new Router();
const csrfProtection = csrf();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const {page = 1} = req.query;
  page = +page;

  const limit = USER_INTERFACE_SETTINGS.articlesPerPage;

  const offset = (page - 1) * USER_INTERFACE_SETTINGS.articlesPerPage;

  const [{count, articles}, allArticles, latestComments, categories] =
    await Promise.all([
      api.getArticles({offset, limit, comments: true}),
      api.getArticles({comments: true}),
      api.getComments({
        order: `DESC`,
        limit: USER_INTERFACE_SETTINGS.latestCommentsCount,
        includeUser: true,
      }),
      api.getCategories(true),
    ]);

  const hotArticles = getHotArticles(allArticles);

  const totalPages = Math.ceil(count / USER_INTERFACE_SETTINGS.articlesPerPage);

  const notEmptyCategories = categories.filter(
      (category) => Number(category.count) > 0
  );
  res.render(`main`, {latestComments, hotArticles, articles, page, totalPages, categories: notEmptyCategories, user});
});

mainRouter.get(`/register`, isGuest, (req, res) => {
  res.render(`sign-up`);
});
mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    firstName: body[`user-first-name`],
    lastName: body[`user-last-name`],
    email: body[`user-email`],
    password: body[`user-password`],
    passwordRepeated: body[`user-password-again`],
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {
      validationMessages,
      firstName: body[`user-first-name`],
      lastName: body[`user-last-name`],
      email: body[`user-email`],
    });
  }
});
mainRouter.get(`/login`, isGuest, csrfProtection, (req, res) => {
  res.render(`login`, {csrfToken: req.csrfToken()});
}
);
mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;
  if (!query) {
    return res.render(`search`, {user});
  }
  try {
    const results = await api.search(query);
    return res.render(`search-result`, {
      user,
      results,
      query,
    });
  } catch (error) {
    return res.render(`search-result`, {
      user,
      results: [],
      query,
    });
  }
});

mainRouter.post(`/login`, csrfProtection, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`login`, {
      email: req.body[`email`],
      validationMessages,
      csrfToken: req.csrfToken(),
    });
  }
});

mainRouter.get(`/logout`, (req, res) => {
  req.session.destroy(() => {
    res.redirect(`/login`);
  });
});

module.exports = mainRouter;
