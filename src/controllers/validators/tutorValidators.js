const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');

const mongooseObjectIdValidator = (id) => mongoose.Types.ObjectId.isValid(id); // returns true or false

exports.editProfileValidator = [
  param('id')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid id param.'),

  body('firstName')
    .isString()
    .withMessage('firstName must be a string.')
    .optional({ nullable: true }),

  body('lastName')
    .isString()
    .withMessage('lastName must be a string.')
    .optional({ nullable: true }),

  body('email')
    .isString()
    .withMessage('email must be a string.')
    .isEmail()
    .withMessage('Invalid email')
    .optional({ nullable: true }),

  body('isTutor')
    .isBoolean()
    .withMessage('isTutor must be a boolean.')
    .optional({ nullable: true }),

  body('avatar')
    .isString()
    .withMessage('avatar must be a string.')
    .optional({ nullable: true }),

  body('subjects')
    .isArray()
    .withMessage('subjects must be an array.')
    .optional({ nullable: true }),

  body('subjects.*')
    .isString()
    .withMessage('Subjects inside of the array must be a string.')
    .isIn(['Math', 'Physics', 'Biology', 'History', 'Programming'])
    .withMessage('Invalid enum choice')
    .optional({ nullable: true }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    return next();
  },
];

exports.getAllChatsValidator = [
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

exports.getOneChatValidator = [
  param('id')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid id param.'),

  param('chatId')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid chatId param.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    return next();
  },
];

exports.sendMessageValidator = [
  param('id')
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid id param.'),

  body('chatId')
    .if(body('receiver').not().exists())
    .notEmpty()
    .withMessage('provide this field or "receiver"')
    .bail()
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid chatId.'),

  body('receiver')
    .if(body('chatId').not().exists())
    .notEmpty()
    .withMessage('provide this field or "chatId"')
    .bail()
    .custom((id) => mongooseObjectIdValidator(id))
    .withMessage('Invalid chatId.'),

  body('content')
    .notEmpty()
    .withMessage('this field is required')
    .isString()
    .withMessage('content must be a string.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    return next();
  },
];
