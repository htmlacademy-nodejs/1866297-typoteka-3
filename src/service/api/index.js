"use strict";
const {Router} = require(`express`);
const category = require(`./category`);
const articles = require(`./articles`);
const search = require(`./search`);
const user = require(`./user`);
const comments = require(`./comments`);
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
  comments(app, new CommentsService(sequelize), new ArticleService(sequelize));
  return app;
};
