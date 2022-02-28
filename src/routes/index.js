const express = require('express');
const indexController = require('../controllers/index');

const router = express.Router();

router.get('/', indexController.getHomePage);
// router.get('/docs', indexController.getDocumentation);

module.exports = router;
