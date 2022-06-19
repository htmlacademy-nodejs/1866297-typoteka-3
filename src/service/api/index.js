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
  category(app, new CategoryService({sequelize, serviceModelName: `_Category`}));
  search(app, new SearchService(sequelize));
  articles(
      app,
      new ArticleService({sequelize, serviceModelName: `_Article`}),
      new CommentsService({sequelize, serviceModelName: `_Comment`})
  );
  user(app, new UserService({sequelize, serviceModelName: `_User`}));
  comments(
      app,
      new CommentsService({sequelize, serviceModelName: `_Comment`}),
      new ArticleService({sequelize, serviceModelName: `_Article`})
  );
  return app;
};
