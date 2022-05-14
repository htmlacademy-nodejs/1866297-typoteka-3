"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const commentsApi = (app, commentService) => {
  const route = new Router();
  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const {order, limit, includeUser} = req.body;
    const comments = await commentService.findAll({
      order,
      limit,
      includeUser,
    });
    res.status(HttpCode.OK).json(comments);
  });
};

module.exports = commentsApi;
