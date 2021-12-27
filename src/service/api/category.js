"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const categoryApi = (app, service) => {
  const route = new Router();
  app.use(`/category`, route);

  route.get(`/`, (req, res) => {
    const categories = service.findAll();
    res.status(HttpCode.OK).json(categories);
  });
};

module.exports = categoryApi;
