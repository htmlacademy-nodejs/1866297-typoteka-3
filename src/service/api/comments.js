"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const {routeParamsValidator, commentExists} = require(`../middlewares`);

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
  route.delete(
      `/:commentId`,
      [routeParamsValidator, commentExists(commentService)],
      async (req, res) => {
        const {commentId} = req.params;
        console.log(commentId);
        const comment = await commentService.drop(commentId);
        return res.status(HttpCode.OK).json(comment);
      }
  );
};

module.exports = commentsApi;
