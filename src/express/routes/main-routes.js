"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories(true),
  ]);
  const notEmptyCategories = categories.filter((category)=> Number(category.count) > 0);
  res.render(`main`, {articles, categories: notEmptyCategories});
});

mainRouter.get(`/register`, (req, res)=> res.render(`sign-up`));
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
