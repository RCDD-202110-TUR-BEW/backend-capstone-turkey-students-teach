const { check, validationResult } = require('express-validator');

exports.validateSignin = [
  check('password')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('password can not be empty!')
    .bail()
    .isLength({ min: 8 })
    .withMessage('password should longer than 8 characters')
    .bail(),
  check('email')
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Invalid email address!')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    return next();
  },
];

exports.validateSignup = [
  check('firstName')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('firstName can not be empty!')
    .bail(),
  check('lastName')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('lastName can not be empty!')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    return next();
  },
];
