"use strict";

const Joi = require(`joi`);
const schemaValidator = require(`../lib/schema-validator`);

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
};

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    "string.empty": ErrorCommentMessage.TEXT,
    "string.min": ErrorCommentMessage.TEXT,
  }),
});

module.exports = async (req, res, next) => {
  const comment = req.body;

  return schemaValidator({
    res,
    next,
    schema,
    data: comment,
    abortEarly: false,
  });
};
