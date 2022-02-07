const express = require('express');

const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');

const app = express();
app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);

require('dotenv').config();
const connectToMongo = require('./db/connection');

const port = process.env.NODE_LOCAL_PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
