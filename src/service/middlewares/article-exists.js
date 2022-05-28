"use strict";

const {HttpCode} = require(`../../constants`);


module.exports = (service) => async (req, res, next) => {
  const {articleId} = req.params;
  const {comments} = req.query;

  const existArticle = await service.findOne(articleId, comments);

  if (!existArticle) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Article with ${articleId} not found`);
  }

  res.locals.article = existArticle;
  return next();
};
