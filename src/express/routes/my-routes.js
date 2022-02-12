"use strict";

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`);

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`comments`, {articles});
});

module.exports = myRouter;
