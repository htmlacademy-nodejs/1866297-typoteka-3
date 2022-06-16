"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {prepareErrors} = require(`../../utils`);
const auth = require(`../middlewares/auth`);
const isAdmin = require(`../middlewares/is-admin`);

const myRouter = new Router();

myRouter.get(`/`, auth, isAdmin, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: false});
  res.render(`my`, {articles, user});
});

myRouter.post(`/`, auth, isAdmin, async (req, res) => {
  const {action} = req.body;
  const {articleId} = req.query;

  if (action === `delete`) {
    await api.deleteArticle({id: articleId});
  }
  res.redirect(302, `/my`);
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

myRouter.post(`/comments/:commentId`, auth, isAdmin, async (req, res) => {
  const {action} = req.body;
  const {commentId} = req.params;

  if (action === `delete`) {
    await api.deleteComment({id: commentId});
  }
  res.redirect(302, `/my/comments`);
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
