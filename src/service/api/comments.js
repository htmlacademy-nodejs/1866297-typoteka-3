"use strict";

const {Router} = require(`express`);
const {HttpCode, USER_INTERFACE_SETTINGS} = require(`../../constants`);
const {getHotArticles} = require(`../../utils`);
const {routeParamsValidator, commentExists} = require(`../middlewares`);

const commentsApi = (app, commentService, articleService) => {
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
        const comment = await commentService.drop(commentId);

        const [latestComments, allArticles] = await Promise.all([
          commentService.findAll({
            order: `DESC`,
            limit: USER_INTERFACE_SETTINGS.latestCommentsCount,
            includeUser: true,
          }),
          articleService.findAll(true),
        ]);

        const hotArticles = getHotArticles(allArticles);

        const io = req.app.locals.socketio;
        await io.emit(`comment:delete`, latestComments, hotArticles);

        return res.status(HttpCode.OK).json(comment);
      }
  );
};

module.exports = commentsApi;
