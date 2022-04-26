"use strict";

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();
const auth = require(`../middlewares/auth`);
const isAdmin = require(`../middlewares/is-admin`);

myRouter.get(`/`, auth, isAdmin, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: false});
  res.render(`my`, {articles, user});
});

myRouter.get(`/comments`, auth, isAdmin, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  res.render(`comments`, {articles, user});
});

myRouter.get(`/categories`, auth, isAdmin, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {user, categories});
});

module.exports = myRouter;
