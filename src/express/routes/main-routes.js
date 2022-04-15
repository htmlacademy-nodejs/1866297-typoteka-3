"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;

  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({offset, limit, comments: true}),
    api.getCategories(true),
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  const notEmptyCategories = categories.filter(
      (category) => Number(category.count) > 0
  );
  res.render(`main`, {articles, page, totalPages, categories: notEmptyCategories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
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
    res.render(`sign-up`, {validationMessages});
  }
});
mainRouter.get(`/login`, (req, res)=> res.render(`login`));
mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  if (!query) {
    return res.render(`search`);
  }
  try {
    const results = await api.search(query);
    return res.render(`search-result`, {
      results,
      query,
    });
  } catch (error) {
    return res.render(`search-empty`, {
      results: [],
      query,
    });
  }
});
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
