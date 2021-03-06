"use strict";

module.exports = {
  DEFAULT_COMMAND: `--help`,
  USER_ARGV_INDEX: 2,
  ExitCode: {
    error: 1,
    success: 0,
  },
  HttpCode: {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
  },
  API_PREFIX: `/api`,
  MAX_ID_LENGTH: 6,
  Env: {
    DEVELOPMENT: `development`,
    PRODUCTION: `production`,
  },
  HttpMethod: {
    GET: `GET`,
    POST: `POST`,
    PUT: `PUT`,
    DELETE: `DELETE`,
  },
  USER_INTERFACE_SETTINGS: {
    hotArticlesLength: 4,
    latestCommentsCount: 4,
    articlesPerPage: 8,
  },
  ARTICLE_MODEL_SETTINGS: {
    titleMaxLength: 250,
    fullTextMaxLength: 1000,
    announceMaxLength: 250,
    photoMaxLength: 15,
  },
};
