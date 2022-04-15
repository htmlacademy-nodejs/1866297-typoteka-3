'use strict';

const Joi = require(`joi`);
const schemaValidator = require(`../lib/schema-validator`);

const numberRegexp = new RegExp(/^[0-9]+$/);

const schema = Joi.object({
  articleId: Joi.string().pattern(numberRegexp),
  commentId: Joi.string().pattern(numberRegexp),
  categoryId: Joi.string().pattern(numberRegexp),
});

module.exports = (req, res, next) => {
  const params = req.params;

  return schemaValidator({
    res,
    cb: next,
    schema,
    data: params,
    abortEarly: false,
  });
};
