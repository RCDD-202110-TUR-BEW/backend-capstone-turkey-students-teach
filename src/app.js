const express = require('express');
const jwt = require('express-jwt');

const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');

const connectToMongo = require('./db/connection');

require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
  })
);

app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);

const port = process.env.NODE_LOCAL_PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
