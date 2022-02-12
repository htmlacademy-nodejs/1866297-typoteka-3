"use strict";

const express = require(`express`);
const {API_PREFIX, HttpCode} = require(`../../constants.js`);
const {getLogger} = require(`../lib/logger.js`);
const routes = require(`../api`);
const DEFAULT_PORT = 3000;

const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    app.listen(port, (err) => {
      if (err) {
        logger.error(
            `An error occurred on server creation: ${err.message}`
        );
        process.exit(1);
      }
      return logger.info(`Listening to connections on ${port}`);
    });
  },
};
