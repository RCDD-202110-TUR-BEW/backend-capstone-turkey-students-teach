const express = require('express');
const authController = require('../controllers/auth');
const {
  validateSignin,
  validateSignup,
} = require('../middleware/validators/authValidator');

const router = express.Router();

router.post('/signin', authController.signin);

router.post('/signin/google', authController.signInWithGmail);

router.post('/signup', authController.signup);

router.get('/signin', (req, res) => {
  res.render('login');
});

module.exports = router;
