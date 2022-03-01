"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `fill-db.sql`;
const MAX_ANNOUNCE_COUNT = 2;
const MAX_COMMENTS = 4;
const MAX_CATEGORIES = 4;
const MAX_SENTENCES_COUNT = 5;
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

const generateComments = (amount, articleId, userCount, comments) => {
  const commentsLength = comments.length;
  return Array.from({length: amount}, () => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments.slice())
      .slice(0, getRandomInt(1, commentsLength))
      .join(` `),
  }));
};

const generateArticles = (
    count,
    titles,
    categories,
    sentences,
    comments,
    userCount
) =>
  Array.from({length: count}, (_, index) => ({
    comments: generateComments(
        getRandomInt(1, MAX_COMMENTS),
        index + 1,
        userCount,
        comments
    ),
    photo: `image${index + 1}.jpg`,
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences.slice())
      .slice(0, getRandomInt(1, MAX_ANNOUNCE_COUNT))
      .join(` `),
    fullText: shuffle(sentences.slice())
      .slice(0, getRandomInt(1, MAX_SENTENCES_COUNT))
      .join(` `),
    category: shuffle(categories.slice()).slice(
        0,
        getRandomInt(1, categories.length - 1)
    ),
    userId: getRandomInt(1, userCount),
  }));

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);
    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const users = [
      {
        email: `ivanov@example.com`,
        password: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`,
      },
      {
        email: `petrov@example.com`,
        password: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`,
      },
      {
        email: `sidorov@example.com`,
        password: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Артём`,
        lastName: `Сидоров`,
        avatar: `avatar3.jpg`,
      },
    ];

    const articles = generateArticles(
        countPublications,
        titles,
        categories,
        sentences,
        commentSentences,
        users.length
    );

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.reduce((acc, article, index) => {
      const randomCategories = shuffle(categories.map((_, idx) => idx)).slice(
          0,
          getRandomInt(1, MAX_CATEGORIES)
      );
      randomCategories.forEach((categoryId) => {
        acc.push({
          articleId: index + 1,
          categoryId,
        });
      });
      return acc;
    }, []);

    const userValues = users
      .map(
          ({email, password, firstName, lastName, avatar}) =>
            `('${email}', '${password}', '${firstName}', '${lastName}', '${avatar}')`
      )
      .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles
      .map(
          ({title, fullText, announce, photo, userId}) =>
            `('${title}', '${fullText}', '${announce}', '${photo}', ${userId})`
      )
      .join(`,\n`);

    const articleCategoryValues = articleCategories
      .map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`)
      .join(`,\n`);

    const commentValues = comments
      .map(
          ({text, userId, articleId}) => `('${text}', ${userId}, ${articleId})`
      )
      .join(`,\n`);

    const content = `
  -- вставка пользователей
  INSERT INTO users(email, password, first_name, last_name, avatar) VALUES
  ${userValues};

  -- вставка категорий
  INSERT INTO categories(name) VALUES
  ${categoryValues};

  -- вставка публикаций
  ALTER TABLE articles DISABLE TRIGGER ALL;
  INSERT INTO articles(title, full_text, announce, photo, user_id) VALUES
  ${articleValues};
  ALTER TABLE articles ENABLE TRIGGER ALL;

  -- связывание публикаций и категорий
  ALTER TABLE article_categories DISABLE TRIGGER ALL;
  INSERT INTO article_categories(article_id, category_id) VALUES
  ${articleCategoryValues};
  ALTER TABLE article_categories ENABLE TRIGGER ALL;

  -- вставка комментариев
  ALTER TABLE comments DISABLE TRIGGER ALL;
  INSERT INTO comments(text, user_id, article_id) VALUES
  ${commentValues};
  ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  },
};
