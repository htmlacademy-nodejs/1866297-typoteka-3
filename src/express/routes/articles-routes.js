"use strict";

const {ensureArray} = require(`../../utils`);
const {Router} = require(`express`);
const uploadMiddleware = require(`../middlewares/upload`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();

articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`articles-by-category`)
);
articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post-empty`, {categories});
});
articlesRouter.post(
    `/add`,
    uploadMiddleware.single(`upload`),
    async (req, res) => {
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
        res.redirect(302, `/my`);
      } catch (error) {
        const categories = await api.getCategories();
        res.render(`edit-post`, {
          categories,
          article: articleData,
        });
      }
    }
);
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const [article, categories] = await Promise.all([
    api.getArticle(req.params.id),
    api.getCategories(),
  ]);
  res.render(`edit-post`, {article, categories});
});
articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true),
  ]);
  const presentCategories = article.categories.map((category) => category.id);
  const categoriesWithCount = categories.filter((category) =>
    presentCategories.includes(category.id)
  );
  res.render(`post-detail`, {article, categories: categoriesWithCount});
});

module.exports = articlesRouter;
