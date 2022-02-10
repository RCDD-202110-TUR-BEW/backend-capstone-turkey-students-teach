const mongoose = require('mongoose');

const subject = mongoose.Schema({
  title: {
    type: String,
    enum: ['Math', 'Physics', 'Biology', 'History', 'Programming'],
    required: true,
  },
});

const student = mongoose.Schema(
  {
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
    passwordHash: {
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
      ref: 'question',
    },
    messagingChannels: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'MessagingChannel',
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

student
  .virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (fullName) {
    this.set('firstName', fullName.substr(0, fullName.indexOf(' ')));
    this.set('lastName', fullName.substr(fullName.indexOf(' ') + 1));
  });

module.exports = {
  studentModel: mongoose.model('Student', student),
  subjectSchema: subject,
};
