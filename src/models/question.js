const mongoose = require('mongoose');

const subject = require('./student').subjectSchema;

const question = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  subjects: {
    type: [subject],
  },
  isSolved: {
    type: Boolean,
    default: false,
  },
  // comments: {
  //   type: [comment]
  // },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
});

module.exports = mongoose.model('Question', question);
