"use strict";

const express = require(`express`);
const {Router} = express;
const fs = require(`fs`).promises;
const {HttpCode} = require(`../../constants.js`);
const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;
const serverRouter = new Router();

const app = express();

app.use(express.json());
app.use(`/`, serverRouter);

serverRouter.get(`/posts`, async (req, res) => {
  try {
    const mocks = await fs.readFile(FILENAME);
    const parsed = JSON.parse(mocks);
    console.log(parsed);
    res.status(HttpCode.OK).json(parsed);
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).json([]);
  }
});

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
