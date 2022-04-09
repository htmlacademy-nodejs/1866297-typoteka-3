'use strict';

const articleValidator = require(`./article-validator.js`);
const commentValidator = require(`./comment-validator.js`);
const articleExists = require(`./article-exists.js`);
const routeParamsValidator = require(`./route-params-validator.js`);


module.exports = {
  articleValidator,
  articleExists,
  commentValidator,
  routeParamsValidator,
};
