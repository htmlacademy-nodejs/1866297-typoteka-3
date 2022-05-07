"use strict";

const Joi = require(`joi`);
const schemaValidator = require(`../lib/schema-validator`);

const ErrorCategoryMessage = {
  MIN_TEXT: `Название категории содержит меньше 5 символов`,
  MAX_TEXT: `Название категории содержит больше 30 символов`,
};

const schema = Joi.object({
  name: Joi.string().trim().min(5).max(30).required().messages({
    "string.empty": ErrorCategoryMessage.MIN_TEXT,
    "string.min": ErrorCategoryMessage.MIN_TEXT,
    "string.max": ErrorCategoryMessage.MAX_TEXT,
  }),
});

module.exports = async (req, res, next) => {
  const category = req.body;

  return schemaValidator({
    res,
    cb: next,
    schema,
    data: category,
    abortEarly: false,
  });
};
