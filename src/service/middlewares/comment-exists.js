"use strict";

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {commentId} = req.params;
  const existComment = await service.findOne(commentId);

  if (!existComment) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Comment with ${commentId} not found`);
  }

  res.locals.comment = existComment;
  return next();
};
