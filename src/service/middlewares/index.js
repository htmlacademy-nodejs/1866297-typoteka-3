'use strict';

const articleValidator = require(`./article-validator.js`);
const commentValidator = require(`./comment-validator.js`);
const articleExists = require(`./article-exists.js`);


module.exports = {
  articleValidator,
  articleExists,
  commentValidator,
};
