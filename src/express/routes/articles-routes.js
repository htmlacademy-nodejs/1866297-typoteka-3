"use strict";

const {ensureArray, prepareErrors} = require(`../../utils`);
const {Router} = require(`express`);
const uploadMiddleware = require(`../middlewares/upload`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();
const {HttpCode} = require(`../../constants`);

const OFFERS_PER_PAGE = 8;

const getViewArticleData = async (id) => {
  const [article, categories] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true),
  ]);
  const presentCategories = article.categories.map((category) => category.id);
  const categoriesWithCount = categories.filter((category) =>
    presentCategories.includes(category.id)
  );
  return {
    article,
    categories: categoriesWithCount,
  };
};

articlesRouter.get(
    `/category/:id`,
    async (req, res) => {
      const {id} = req.params;
      let {page = 1} = req.query;
      page = +page;

      const limit = OFFERS_PER_PAGE;

      const offset = (page - 1) * OFFERS_PER_PAGE;

      const [categories, {articles, count}] = await Promise.all([
        api.getCategories(true),
        api.getArticlesByCategoryId({
          offset,
          limit,
          comments: true,
          id
        }),
      ]);

      const categoryExists = categories.filter(
          (category) => category.id === Number(id)
      )[0];

      if (!categoryExists) {
        return res
            .status(HttpCode.NOT_FOUND)
            .send(`Category with ${id} not found`);
      }

      const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

      return res.render(`articles-by-category`, {
        articles,
        page,
        totalPages,
        categories,
        currentCategory: categoryExists,
      });
    }
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
        photo: file ? file.filename : ``,
        title: body.title,
        announce: body.announce,
        fullText: body[`full-text`],
        categories: ensureArray(body.categories),
      };

      try {
        await api.createArticle(articleData);
        res.redirect(302, `/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await api.getCategories();

        res.render(`edit-post`, {
          categories,
          article: articleData,
          validationMessages,
        });
      }
    }
);
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(),
  ]);
  res.render(`edit-post`, {article, categories, id});
});
articlesRouter.post(
    `/edit/:id`,
    uploadMiddleware.single(`upload`),
    async (req, res) => {
      const {body, file} = req;
      const {id} = req.params;
      const articleData = {
        photo: file ? file.filename : ``,
        title: body.title,
        announce: body.announce,
        fullText: body[`full-text`],
        categories: ensureArray(body.categories),
      };

      try {
        await api.editOffer(id, articleData);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await api.getCategories();
        res.render(`edit-post`, {
          id,
          categories,
          article: articleData,
          validationMessages,
        });
      }
    }
);
articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const {article, categories} = await getViewArticleData(id);
  res.render(`post-detail`, {article, categories, id});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment = ``} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(302, `/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {article, categories} = await getViewArticleData(id);
    res.render(`post-detail`, {
      article,
      categories,
      id,
      validationMessages,
    });
  }
});

module.exports = articlesRouter;
