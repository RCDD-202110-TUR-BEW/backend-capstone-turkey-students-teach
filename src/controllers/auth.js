const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const { OAuth2Client } = require('google-auth-library');
const { StudentModel } = require('../models/student');
const logger = require('../utils/logger');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
/**
 * Note: for google authentication:
 * 1. add your google client_id to env file.
 * 2. add your google client_id to ejs /login index.js file.
 */

/**
 * Returns jwt token
 * @returns {string}
 */
function generateAccessToken(student) {
  return jwt.sign(student, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });
}

/**
 * Generates and return unique username
 * @returns {string}
 */
async function getUniqueUserName(proposedName) {
  const username = slugify(proposedName, {
    replacement: '_', // replace spaces with replacement character, defaults to `-`
    lower: true, // convert to lower case, defaults to `false`
    locale: 'tr', // language code of the locale to use
  });
  const student = await StudentModel.findOne({ username });
  if (student) {
    // if student exist call function again with adding random numbers
    const newProposedName = username + Math.floor(Math.random() * 100 + 1);
    return getUniqueUserName(newProposedName);
  }
  // if student not exist return username
  return username;
}

module.exports = {
  signin: async (req, res) => {
    const { email, password } = req.body;

    // check username and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'email and password fields are required' });
    }

    try {
      // find student from email
      const student = await StudentModel.findOne({ email });

      if (!student) {
        return res.status(400).json({ error: 'wrong email or password' });
      }
      if (student.isSignUpWithGoogle) {
        // student should login via using gmail.
        // because there is not any password in database for this student.
        // it requires google oauth verification.
        return res.status(400).json({
          error: 'This account is linked to Google. Please log in via Google',
        });
      }

      // compare sent password to saved one
      const result = await bcrypt.compare(password, student.passwordHash);
      if (!result) {
        return res.status(400).json({ error: 'wrong email or password' });
      }

      // generate jwt token and send it to client with student information in payload
      const token = generateAccessToken({ student });
      return res.status(200).json(token);
    } catch (err) {
      return res.status(400).json(err);
    }
  },
  signup: async (req, res) => {
    const { firstName, lastName, password, avatar, email, isTutor, subjects } =
      req.body;

    // password are required,
    // length should longer than 6 characters
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ error: 'password should longer than 8 characters' });
    }

    // Check existing student with given email
    try {
      const existingStudent = await StudentModel.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ error: `${email}: email already exist` });
      }
    } catch (error) {
      return res.status(400).json({ error });
    }

    // hash password before persistion
    const passwordHash = await bcrypt.hash(password, 10);

    // get a unique username
    const username = await getUniqueUserName(
      firstName.trim() + lastName.trim()
    );

    try {
      // Creating student field
      const student = new StudentModel({
        firstName,
        lastName,
        username,
        avatar,
        passwordHash,
        email,
        isTutor,
      });

      if (subjects) {
        student.subjects = subjects;
      }

      const newStudent = await student.save();

      // Generate jwt token
      const token = generateAccessToken({ student: newStudent });

      return res.status(201).json(token);
    } catch (error) {
      return res.status(400).json({ error });
    }
  },
  signInWithGmail: async (req, res) => {
    // get google token
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Can't verify with google" });
    }

    // verify google token via using google oauth library
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      return payload;
    }

    const payload = await verify().catch((e) =>
      logger.error(`auth.js payload error: ${e}`)
    );

    if (!payload) {
      return res
        .status(400)
        .json({ error: "Can't verify with google sign up" });
    }

    const { email, picture } = payload;
    const firstName = payload.given_name;
    const lastName = payload.family_name;

    try {
      // Check existing student with given email
      const existingStudent = await StudentModel.findOne({ email });

      if (existingStudent) {
        /**
         * User persisted to database before via using google ,or email signup
         */
        // student was signed up with email before
        if (!existingStudent.isSignUpWithGoogle) {
          return res.status(400).json({
            error:
              'This account has linked with email signup. Please log in via using email and password',
          });
        }
        // student was signed up with google before
        // log in user via sending a jwt token
        const newToken = generateAccessToken({ student: existingStudent });
        return res.status(200).json(newToken);
      }
      /**
       * Persist google verified student to database
       */
      // create unique username
      const username = await getUniqueUserName(
        firstName.trim() + lastName.trim()
      );

      // persist student to database
      const newStudent = await StudentModel.create({
        firstName,
        lastName,
        username,
        avatar: picture,
        email,
        isSignUpWithGoogle: true,
      });

      // generate access token and send it
      const jwtToken = generateAccessToken({ student: newStudent });
      return res.status(201).json(jwtToken);
    } catch (error) {
      return res.status(400).json({ error });
    }
  },
  getStudent: async (req, res) => res.status(200).json(req.user),
};
