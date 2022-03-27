"use strict";

// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  testRunner: `jest-circus/runner`,
  testTimeout: 10000,
};

module.exports = config;
