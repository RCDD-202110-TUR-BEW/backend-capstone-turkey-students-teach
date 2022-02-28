require('dotenv').config();
const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = function onlyAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return next();
  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return next();
    req.user = user.student;

    next();
  });
};
