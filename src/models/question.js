const mongoose = require('mongoose');

const subject = mongoose.Schema({
  title: {
    type: String,
    enum: ['Math', 'Physics', 'Biology', 'History', 'Programming'],
    default: 'Math',
    required: true,
  },
});

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
