// username: {
//   type: String,
//   required: true,
//   unique: true,
// },
// firstName: {
//   type: String,
//   required: true,
// },
// lastName: {
//   type: String,
//   required: true,
// },
// passwordHash: {
//   type: String,
//   required: true,
// },
// email: {
//   type: String,
//   required: true,
// },
// isTutor: {
//   type: Boolean,
//   default: false,
// },
// subjects: {
//   type: [subject],
// },
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { studentModel } = require('../models/student');

function generateAccessToken(student) {
  return jwt.sign(student, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

module.exports = {
  signin: async (req, res) => {},
  signup: async (req, res) => {
    const {
      username,
      firstName,
      lastName,
      password,
      avatar,
      email,
      isTutor,
      subjects,
    } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: 'password should longer than 6 characters' });
    }

    // Check username is unique
    try {
      let student = await studentModel.findOne({ username });

      if (student) {
        return res
          .status(400)
          .json({ error: `${username}: username already used` });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      student = studentModel.create({
        firstName,
        lastName,
        username,
        avatar,
        passwordHash,
        email,
        isTutor,
        'subjects.title': subjects,
      });

      const token = generateAccessToken({ student });

      console.log(`token,${token}`);

      return res.status(200).json(token);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  signInWithGmail: async () => {},
};
