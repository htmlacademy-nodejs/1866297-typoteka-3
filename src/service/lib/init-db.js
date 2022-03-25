"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, articles, users}) => {
  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce(
      (acc, next) => ({
        [next.name]: next.id,
        ...acc,
      }),
      {}
  );

  const userModels = await User.bulkCreate(users, {
    include: [Aliase.ARTICLES, Aliase.COMMENTS],
  });

  const userIdByEmail = userModels.reduce((acc, next) => {
    acc[next.email] = next.id;
    return acc;
  }, {});

  articles.forEach((article) => {
    article.userId = userIdByEmail[article.user];
    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {
      include: [Aliase.COMMENTS],
    });
    await articleModel.addCategories(
        article.categories.map((name) => categoryIdByName[name])
    );
  });

  await Promise.all(articlePromises);
};
