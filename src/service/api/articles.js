"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {
  articleValidator,
  articleExists,
  commentValidator,
  routeParamsValidator,
} = require(`../middlewares`);


const articlesApi = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments = false} = req.query;
    let articles;
    if (limit || offset) {
      articles = await articleService.findPage({offset, limit, comments});
    } else {
      articles = await articleService.findAll(comments);
    }
    res.status(HttpCode.OK).json(articles);
  });
  route.post(`/`, articleValidator, async (req, res) => {
    const newArticle = await articleService.create(req.body);
    res.status(HttpCode.CREATED).json(newArticle);
  });
  route.get(
      `/:articleId`,
      [routeParamsValidator, articleExists(articleService)],
      (req, res) => {
        res.status(HttpCode.OK).json(res.locals.article);
      }
  );
  route.put(`/:articleId`, [routeParamsValidator, articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const existArticle = await articleService.findOne(articleId);

    if (!existArticle) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    const updatedArticle = articleService.update(articleId, req.body);
    return res.status(HttpCode.OK).json(updatedArticle);
  });
  route.delete(`/:articleId`, [routeParamsValidator], async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);
    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Article not found`);
    }
    return res.status(HttpCode.OK).json(article);
  });
  route.get(
      `/:articleId/comments`,
      [routeParamsValidator, articleExists(articleService)],
      async (req, res) => {
        const comments = await commentService.findAll({articleId: res.locals.article.id});
        res.status(HttpCode.OK).json(comments);
      }
  );
  route.delete(
      `/:articleId/comments/:commentId`,
      [routeParamsValidator, articleExists(articleService)],
      async (req, res) => {
        const {commentId} = req.params;
        const deletedComment = await commentService.drop(commentId);

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
      [routeParamsValidator, articleExists(articleService), commentValidator],
      async (req, res) => {
        const {article} = res.locals;
        const newComment = await commentService.create(article.id, req.body);
        res.status(HttpCode.CREATED).json(newComment);
      }
  );
  route.get(`/categories/:categoryId`, [routeParamsValidator], async (req, res) => {
    const {categoryId} = req.params;
    const {offset, limit} = req.query;
    const articles = await articleService.findPageByCategory({
      offset,
      limit,
      id: categoryId,
    });
    res.status(HttpCode.OK).json(articles);
  });
};

module.exports = articlesApi;
