const express = require('express');
const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');

const app = express();

app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);
