"use strict";

const express = require(`express`);
const path = require(`path`);

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}
const session = require(`express-session`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 1800000,
  checkExpirationInterval: 60000,
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(
    session({
      secret: SESSION_SECRET,
      store: mySessionStore,
      resave: false,
      proxy: true,
      saveUninitialized: false,
    })
);

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
