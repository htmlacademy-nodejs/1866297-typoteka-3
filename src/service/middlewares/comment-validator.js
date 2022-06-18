"use strict";

const Joi = require(`joi`);
const schemaValidator = require(`../lib/schema-validator`);

const ErrorCommentMessage = {
  USER_ID: `Некорректный идентификатор пользователя`,
  TEXT: `Комментарий содержит меньше 20 символов`,
};

const schema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": ErrorCommentMessage.USER_ID,
  }),
  text: Joi.string().min(20).required().messages({
    "string.empty": ErrorCommentMessage.TEXT,
    "string.min": ErrorCommentMessage.TEXT,
  }),
});

module.exports = (req, res, next) => {
  const comment = req.body;

  return schemaValidator({
    res,
    cb: next,
    schema,
    data: comment,
    abortEarly: false,
  });
};
