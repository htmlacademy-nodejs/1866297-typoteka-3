"use strict";

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {categoryId} = req.params;
  const existCategory = await service.findOne(categoryId);

  if (!existCategory) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Category with ${categoryId} not found`);
  }

  res.locals.category = existCategory;
  return next();
};
