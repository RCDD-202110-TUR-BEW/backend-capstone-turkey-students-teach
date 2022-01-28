const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signin', authController.signin);

router.post('/signup', authController.signup);

router.post('/google', authController.signinWithGmail);

module.exports = router;
