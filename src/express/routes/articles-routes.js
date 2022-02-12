"use strict";

const {ensureArray} = require(`../../utils`);
const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();

articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`articles-by-category`)
);
articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post-empty`, {categories});
});
articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    upload: file ? file.filename : ``,
    createdDate: body[`created-date`],
    title: body.title,
    announce: body.announce,
    fullText: body[`full-text`],
    category: ensureArray(body.category),
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`, {});
  }
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const [article, categories] = await Promise.all([
    api.getArticle(req.params.id),
    api.getCategories(),
  ]);
  res.render(`edit-post`, {article, categories});
});
articlesRouter.get(`/:id`, (req, res) => res.render(`post-detail`));

module.exports = articlesRouter;
