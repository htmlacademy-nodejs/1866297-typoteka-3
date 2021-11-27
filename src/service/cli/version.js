"use strict";

const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    const {version} = packageJsonFile;
    console.info(version);
  },
};
