require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function onlyAuthenticated(req, res, next) {
  const { accessToken } = req.cookies;
  try {
    const error = { meesage: 'There is no session; please sign in.' };
    if (!accessToken) throw error;
    const user = jwt.verify(accessToken, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json(err);
  }
};
