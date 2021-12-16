"use strict";

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (req, res)=> res.render(`main`));
mainRouter.get(`/register`, (req, res)=> res.render(`registration`));
mainRouter.get(`/login`, (req, res)=> res.render(`login`));
mainRouter.get(`/search`, (req, res) => res.render(`search`));
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
