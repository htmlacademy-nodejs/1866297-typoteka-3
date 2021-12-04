"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const EARLIEST_POSSIBLE_DATE = Date.now() - 1000 * 60 * 60 * 24 * 90;
const MAX_PUBLICATIONS_COUNT = 1000;
const MAX_ANNOUNCE_COUNT = 5;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generatePublications = (count, titles, categories, sentences) =>
  Array.from({length: count}, () => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: new Date(
        getRandomInt(EARLIEST_POSSIBLE_DATE, Date.now() - 1)
    ).toISOString(),
    announce: shuffle(sentences.slice())
      .slice(0, getRandomInt(1, MAX_ANNOUNCE_COUNT))
      .join(` `),
    fullText: shuffle(sentences.slice())
      .slice(0, getRandomInt(1, sentences.length - 1))
      .join(` `),
    category: shuffle(categories.slice()).slice(
        0,
        getRandomInt(1, categories.length - 1)
    ),
  }));

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countPublications > MAX_PUBLICATIONS_COUNT) {
      console.info(`Не больше 1000 публикаций`);
      process.exit(ExitCode.error);
    }
    const content = JSON.stringify(
        generatePublications(countPublications, titles, categories, sentences)
    );

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
