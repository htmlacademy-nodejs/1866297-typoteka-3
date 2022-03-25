"use strict";

const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger.js`);
const initDatabase = require(`../lib/init-db.js`);
const logger = getLogger({});

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_ANNOUNCE_COUNT = 3;
const MIN_TEXT_COUNT = 5;
const MAX_TEXT_COUNT = 10;
const MAX_COMMENTS = 4;
const MAX_COMMENTS_AMOUNT = 2;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (amount, comments, users) => {
  return Array.from({length: amount}, () => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: shuffle(comments.slice())
      .slice(0, getRandomInt(1, MAX_COMMENTS_AMOUNT))
      .join(` `),
  }));
};

const getRandomSubArray = (array, min, max) => {
  const start = min ? min : 1;
  const end = max ? max : array.length - 1;
  return shuffle(array.slice()).slice(0, getRandomInt(start, end));
};

const generateArticles = (
    count,
    titles,
    categories,
    sentences,
    comments,
    users
) =>
  Array.from({length: count}, (_, index) => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
    title: titles[getRandomInt(0, titles.length - 1)],
    photo: `image${index + 1}.jpg`,
    announce: shuffle(sentences.slice())
      .slice(0, getRandomInt(1, MAX_ANNOUNCE_COUNT))
      .join(` `),
    fullText: getRandomSubArray(sentences, MIN_TEXT_COUNT, MAX_TEXT_COUNT).join(
        ` `
    ),
    categories: getRandomSubArray(categories),
  }));

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const users = [
      {
        email: `ivanov@example.com`,
        password: `ivanov`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`,
      },
      {
        email: `petrov@example.com`,
        password: `petrov`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`,
      },
      {
        email: `sidorov@example.com`,
        password: `sidorov`,
        firstName: `Артём`,
        lastName: `Сидоров`,
        avatar: `avatar3.jpg`,
      },
    ];

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(
        countArticles,
        titles,
        categories,
        sentences,
        comments,
        users
    );

    return initDatabase(sequelize, {articles, categories, users});
  },
};
