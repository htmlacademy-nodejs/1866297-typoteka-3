"use strict";

const pino = require(`pino`);

const logger = pino({
  name: `base-logger`,
  level: `info`,
  transport: {
    target: `pino-pretty`,
  },
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  },
};
