"use strict";
const {Router} = require(`express`);
const category = require(`../api/category`);
const articles = require(`../api/articles`);
const search = require(`../api/search`);
const user = require(`../api/user`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentsService,
  UserService,
} = require(`../data-service`);


defineModels(sequelize);


module.exports = async () => {
  const app = new Router();
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  articles(app, new ArticleService(sequelize), new CommentsService(sequelize));
  user(app, new UserService(sequelize));
  return app;
};
