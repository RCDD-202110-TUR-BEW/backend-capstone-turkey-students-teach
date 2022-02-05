const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;
const subject = require('./student').subjectSchema;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
const questionSchema = new Schema(
  {
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
    comments: {
      type: [commentSchema],
      default: [],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('question', questionSchema);
