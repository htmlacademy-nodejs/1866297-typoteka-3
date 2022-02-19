"use strict";
const {Router} = require(`express`);
const category = require(`../api/category`);
const articles = require(`../api/articles`);
const search = require(`../api/search`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentsService,
} = require(`../data-service`);

const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

module.exports = async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  articles(app, new ArticleService(mockData), new CommentsService());
  return app;
};
