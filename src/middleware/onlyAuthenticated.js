require('dotenv').config();
const jwt = require('jsonwebtoken');

//  error messages
const sessionNotFoundError = {
  meesage: 'you are not signed in. Please sign in',
};

// eslint-disable-next-line consistent-return
module.exports = function onlyAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json(sessionNotFoundError);
  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
};
