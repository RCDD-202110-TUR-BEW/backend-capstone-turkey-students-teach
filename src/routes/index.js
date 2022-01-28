const express = require('express');
const indexController = require('../controllers/index');
const tutorRouter = require('./tutor');
const questionRouter = require('./question');

const router = express.Router();
const app = express();

router.get('/', indexController.getHomePage);
router.get('/docs', indexController.getDocumentation);

app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);

module.exports = router;
