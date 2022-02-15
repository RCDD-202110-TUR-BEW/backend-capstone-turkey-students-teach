require('dotenv').config();
const express = require('express');
const connectToMongo = require('./db/connection');

const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
