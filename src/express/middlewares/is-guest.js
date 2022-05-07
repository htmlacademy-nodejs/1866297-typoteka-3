"use strict";

module.exports = (req, res, next) => {
  const {user} = req.session;

  if (user) {
    return res.redirect(`/`);
  }
  return next();
};
