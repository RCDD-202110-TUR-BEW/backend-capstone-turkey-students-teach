require('dotenv').config();
const express = require('express');
const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');
const authRouter = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());

app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);
app.use('/auth', authRouter);

app.get('/login', (req, res) => {
  res.render('login');
});

module.exports = app;
