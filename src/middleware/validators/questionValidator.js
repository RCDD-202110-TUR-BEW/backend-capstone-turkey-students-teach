const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');

const mongooseObjectIdValidator = (id) => mongoose.Types.ObjectId.isValid(id); // returns true or false

exports.updateQuestionValidator = [
  param('id')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid id param.'),

  body('title')
    .isString()
    .withMessage('title must be a string.')
    .notEmpty()
    .withMessage('title should not be empty.'),

  body('content')
    .isString()
    .withMessage('content must be a string.')
    .notEmpty()
    .withMessage('content should not be empty.'),

  body('subjects')
    .isArray()
    .withMessage('subjects must be an array of objects.')
    .optional({ nullable: true }),

  body('subjects.*')
    .isObject()
    .withMessage('Subjects inside of the array must be an object.')
    .isIn([
      { title: 'Math' },
      { title: 'Physics' },
      { title: 'Biology' },
      { title: 'History' },
      { title: 'Programming' },
    ])
    .withMessage('Invalid subject choice')
    .optional({ nullable: true }),

  body('comments')
    .isArray()
    .withMessage('comments must be an array of strings.')
    .optional({ nullable: true }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return next();
  },
];

exports.deleteQuestionValidator = [
  param('id')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid id param.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    return next();
  },
];

exports.createCommentValidator = [
  param('id')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid id param.'),

  body('content')
    .notEmpty()
    .withMessage('content should not be empty')
    .isString()
    .withMessage('content must be a string.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    return next();
  },
];
exports.updateCommentValidator = [
  param('id')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid id param.'),

  param('commentid')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid comment id param.'),

  body('content')
    .notEmpty()
    .withMessage('content should not be empty')
    .isString()
    .withMessage('content must be a string.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    return next();
  },
];
exports.deltetCommentValidator = [
  param('id')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid id param.'),

  param('commentid')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid comment id param.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    return next();
  },
];
