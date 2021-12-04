"use strict";

const packageJsonFile = require(`../../../package.json`);
const chalk = require(`chalk`);

module.exports = {
  name: `--version`,
  run() {
    const {version} = packageJsonFile;
    console.info(chalk.blue(version));
  },
};
