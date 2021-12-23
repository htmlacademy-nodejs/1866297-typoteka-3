"use strict";

const express = require(`express`);
const {API_PREFIX} = require(`../../constants.js`);
const routes = require(`../api`);
const DEFAULT_PORT = 3000;

const app = express();

app.use(express.json());

app.use(API_PREFIX, routes);


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  },
};
