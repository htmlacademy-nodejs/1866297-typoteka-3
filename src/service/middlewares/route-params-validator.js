'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const numberRegexp = new RegExp(/^[0-9]+$/);

const schema = Joi.object({
  articleId: Joi.string().pattern(numberRegexp),
  commentId: Joi.string().pattern(numberRegexp),
  categoryId: Joi.string().pattern(numberRegexp),
});

module.exports = (req, res, next) => {
  const params = req.params;

  const {error} = schema.validate(params);

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
