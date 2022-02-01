const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signin', authController.signin);

router.post('/signin/google', authController.signInWithGmail);

router.post('/signup', authController.signup);

module.exports = router;
