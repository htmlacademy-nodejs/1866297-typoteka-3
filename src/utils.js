"use strict";
const {USER_INTERFACE_SETTINGS} = require(`./constants`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i],
    ];
  }

  return someArray;
};

const ensureArray = (value) => {
  return Array.isArray(value) ? value : [value];
};

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

const getHotArticles = (allArticles) => {
  return allArticles
    .map(({id, announce, comments}) => {
      return {
        id,
        announce,
        commentsLength: comments.length,
      };
    })
    .filter(({commentsLength}) => commentsLength > 0)
    .sort((art1, art2) => {
      return art2.commentsLength - art1.commentsLength;
    })
    .slice(0, USER_INTERFACE_SETTINGS.hotArticlesLength);
};

module.exports = {
  shuffle,
  getRandomInt,
  ensureArray,
  prepareErrors,
  getHotArticles,
};
