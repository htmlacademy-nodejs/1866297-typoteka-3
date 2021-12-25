"use strict";

const {HttpCode} = require(`../../constants`);


module.exports = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const existArticle = service.findOne(articleId);

  if (!existArticle) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Article with ${articleId} not found`);
  }

  res.locals.article = existArticle;
  return next();
};
