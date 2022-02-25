const { check, validationResult } = require('express-validator');

const validateQuestion = [
  check('title', 'Title must be at least 3 characters long')
    .notEmpty()
    .withMessage('Title should not be empty')
    .isLength({ min: 3 }),
  check('content').notEmpty().withMessage('Content should not be empty'),
  check('subjects').notEmpty().withMessage('Subjects should not be empty'),
  check('comments').isEmpty().withMessage('Comments should be empty'),
  // eslint-disable-next-line consistent-return
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(errors.array());
    next();
  },
];

module.exports = validateQuestion;
