'use strict';

const articleValidator = require(`./article-validator.js`);
const commentValidator = require(`./comment-validator.js`);
const commentExists = require(`./comment-exists.js`);
const articleExists = require(`./article-exists.js`);
const routeParamsValidator = require(`./route-params-validator.js`);
const categoryValidator = require(`./category-validator.js`);
const categoryExists = require(`./category-exists.js`);
const userValidator = require(`./user-validator.js`);


module.exports = {
  articleValidator,
  articleExists,
  commentValidator,
  commentExists,
  routeParamsValidator,
  categoryValidator,
  categoryExists,
  userValidator,
};
