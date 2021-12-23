"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {articleValidator, articleExists, commentValidator} = require(`../middlewares`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK).json(articles);
  });
  route.post(`/`, articleValidator, (req, res) => {
    const newArticle = articleService.create(req.body);
    res.status(HttpCode.CREATED).json(newArticle);
  });
  route.get(`/:articleId`, articleExists(articleService), (req, res) => {
    res.status(HttpCode.OK).json(res.locals.article);
  });
  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = articleService.update(articleId, req.body);
    res.status(HttpCode.CREATED).json(updatedArticle);
  });
  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.delete(articleId);
    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Article not found`);
    }
    return res.status(HttpCode.OK).json(article);
  });
  route.get(
      `/:articleId/comments`,
      articleExists(articleService),
      (req, res) => {
        const comments = commentService.findAll(res.locals.article);
        res.status(HttpCode.OK).json(comments);
      }
  );
  route.delete(
      `/:articleId/comments/:commentId`,
      articleExists(articleService),
      (req, res) => {
        const {commentId} = req.params;
        const {article} = res.locals;
        const deletedComment = commentService.delete(article, commentId);

        if (!deletedComment) {
          return res
            .status(HttpCode.NOT_FOUND)
            .send(`Comment with ${commentId} not found`);
        }

        return res.status(HttpCode.OK).json(deletedComment);
      }
  );
  route.post(
      `/:articleId/comments`,
      [articleExists(articleService), commentValidator],
      (req, res) => {
        const {article} = res.locals;
        const newComment = commentService.create(article, req.body);
        res.status(HttpCode.CREATED).json(newComment);
      }
  );
};
