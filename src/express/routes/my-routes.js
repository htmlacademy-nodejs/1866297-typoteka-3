"use strict";

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();
const {prepareErrors} = require(`../../utils`);
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
  const commentsArray = articles.reduce((acc, {title, comments}) => {
    const modifiedComments = comments.map((comment) => {
      comment[`title`] = title;
      return comment;
    });
    return acc.concat(...modifiedComments);
  }, []);
  const sortedCommentsArray = commentsArray.sort((com1, com2) => {
    if (com1.createdAt < com2.createdAt) {
      return 1;
    }
    if (com1.createdAt > com2.createdAt) {
      return -1;
    }
    return 0;
  });
  res.render(`comments`, {comments: sortedCommentsArray, user});
});

myRouter.get(`/categories`, auth, isAdmin, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {user, categories});
});

myRouter.post(`/categories`, auth, isAdmin, async (req, res) => {
  const {user} = req.session;
  const {category, action} = req.body;
  const {categoryId} = req.query;
  try {
    switch (action) {
      case `put`:
        await api.updateCategory({name: category, id: categoryId});
        break;
      case `delete`:
        await api.deleteCategory({id: categoryId});
        break;
      default:
        await api.createCategory({name: category});
    }
    res.redirect(302, `categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(`all-categories`, {user, categories, validationMessages});
  }
});

module.exports = myRouter;
