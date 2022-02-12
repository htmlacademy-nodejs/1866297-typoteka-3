"use strict";


const express = require(`express`);
const path = require(`path`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload/img`;
const app = express();

const mainRouter = require(`./routes/main-routes.js`);
const articlesRouter = require(`./routes/articles-routes.js`);
const myRouter = require(`./routes/my-routes.js`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);


app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT, () => {
  console.log(`server running on port ${DEFAULT_PORT}`);
});
