const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const connectToMongo = require('./db/connection');
const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');

const app = express();
app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);

require('dotenv').config();

const port = process.env.NODE_LOCAL_PORT;

app.use(express.json());

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});
app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);

module.exports = app;
