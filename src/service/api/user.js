'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {userValidator} = require(`../middlewares`);
const passwordUtils = require(`../lib/password`);

const route = new Router();

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`,
};

module.exports = (app, service) => {
  app.use(`/user`, route);

  route.post(`/`, userValidator(service), async (req, res) => {
    const data = req.body;

    data.password = await passwordUtils.hash(data.password);

    const newUser = await service.create(data);

    delete newUser.password;

    res.status(HttpCode.CREATED).json(newUser);
  });

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;
    const user = await service.findByEmail(email);

    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
      return;
    }
    const passwordIsCorrect = await passwordUtils.compare(password, user.password);

    if (passwordIsCorrect) {
      delete user.password;
      res.status(HttpCode.OK).json(user);
    } else {
      res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
    }
  });
};
