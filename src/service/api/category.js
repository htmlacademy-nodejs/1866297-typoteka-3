"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const categoryApi = (app, service) => {
  const route = new Router();
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK).json(categories);
  });
};

module.exports = categoryApi;
