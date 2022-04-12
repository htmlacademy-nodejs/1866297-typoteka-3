"use strict";

const {HttpCode} = require(`../../constants`);
const Joi = require(`joi`);

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

  const {error} = await schema.validate(comment, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
