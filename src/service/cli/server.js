"use strict";

const express = require(`express`);
const http = require(`http`);
const {API_PREFIX, HttpCode} = require(`../../constants.js`);
const {getLogger} = require(`../lib/logger.js`);
const routesPromise = require(`../api`);
const DEFAULT_PORT = 3000;
const app = express();
const logger = getLogger({name: `api`});


const initApp = async () => {
  app.use(express.json());

  app.use((req, res, next) => {
    logger.debug(`Request on route ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code ${res.statusCode}`);
    });
    next();
  });
  const routes = await routesPromise();

  app.use(API_PREFIX, routes);

  app.use((req, res) => {
    res.status(HttpCode.NOT_FOUND).send(`Not found`);
    logger.error(`Route not found: ${req.url}`);
  });

  app.use((err, _req, _res, _next) => {
    logger.error(`An error occurred on processing request: ${err.message}`);
  });
};

module.exports = {
  name: `--server`,
  async run(args) {
    initApp();
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    http
      .createServer(app)
      .listen(port)
      .on(`listening`, () => {
        logger.info(`Listening to connections on ${port}`);
      })
      .on(`error`, ({message}) => {
        logger.error(
            `An error occurred on server creation: ${message}`
        );
        process.exit(1);
      });
  },
};
