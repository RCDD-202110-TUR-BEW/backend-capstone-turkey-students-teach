const mongoose = require('mongoose');

const subject = mongoose.Schema({
  title: {
    type: String,
    enum: ['Math', 'Physics', 'Biology', 'History', 'Programming'],
    default: 'Math',
    required: true,
  },
});

const student = mongoose.schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isTutor: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
  },
  subjects: {
    type: [subject],
  },
  questions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Question',
  },
  inbox: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'messagingChannel',
  },
});

module.exports = mongoose.model('Student', student);
