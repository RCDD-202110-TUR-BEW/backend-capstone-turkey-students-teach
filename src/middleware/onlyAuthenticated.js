const onlyAuthenticated = (req, res, next) => {
  next();
};

module.exports = onlyAuthenticated;
