const express = require('express');
const authController = require('../controllers/auth');
const {
  validateSignin,
  validateSignup,
} = require('../controllers/validators/authValidator');
const onlyAuthenticated = require('../middleware/onlyAuthenticated');

const router = express.Router();

router.post('/signin', validateSignin, authController.signin);

router.post('/signin/google', authController.signInWithGmail);

router.post('/signup', [validateSignin, validateSignup], authController.signup);

router.get('/me', onlyAuthenticated, authController.getStudent);

router.get('/signin', (req, res) => {
  res.render('login');
});

module.exports = router;
