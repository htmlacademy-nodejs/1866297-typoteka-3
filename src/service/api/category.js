"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const {
  categoryValidator,
  routeParamsValidator,
  categoryExists,
} = require(`../middlewares`);

const categoryApi = (app, service) => {
  const route = new Router();
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK).json(categories);
  });
  route.post(`/`, [categoryValidator], async (req, res) => {
    const category = await service.create(req.body);
    res.status(HttpCode.OK).json(category);
  });
  route.put(
      `/:categoryId`,
      [routeParamsValidator, categoryExists(service), categoryValidator],
      async (req, res) => {
        const {name} = req.body;
        const {categoryId} = req.params;
        const updatedCategory = await service.update(categoryId, {name});
        return res.status(HttpCode.OK).json(updatedCategory);
      }
  );
  route.delete(
      `/:categoryId`,
      [routeParamsValidator, categoryExists(service)],
      async (req, res) => {
        const {categoryId} = req.params;
        const [{count}] = await service.findAllInArticles(categoryId);
        if (Number(count) !== 0) {
          return res.status(HttpCode.BAD_REQUEST).send(`Category in use`);
        }
        const category = await service.drop(categoryId);
        return res.status(HttpCode.OK).json(category);
      }
  );
};

module.exports = categoryApi;
