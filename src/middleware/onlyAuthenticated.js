require('dotenv').config();
const jwt = require('jsonwebtoken');

//  error messages
const sessionNotFoundError = {
  meesage: 'you are not signed in. Please sign in',
};

module.exports = function onlyAuthenticated(req, res, next) {
  const { accessToken } = req.cookies;
  try {
    if (!accessToken) throw sessionNotFoundError;
    const user = jwt.verify(accessToken, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json(err);
  }
};
