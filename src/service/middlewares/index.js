'use strict';

const articleValidator = require(`./article-validator`);
const commentValidator = require(`./comment-validator`);
const articleExists = require(`./article-exists`);


module.exports = {
  articleValidator,
  articleExists,
  commentValidator,
};
