'use strict';
const {HttpCode} = require(`../../constants`);


module.exports = ({res, next, schema, data, abortEarly}) => {
  const {error} = schema.validate(data, {abortEarly});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }
  return next();
};
