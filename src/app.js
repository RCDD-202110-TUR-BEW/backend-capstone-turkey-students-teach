require('dotenv').config();
const express = require('express');
const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');
const authRouter = require('./routes/auth');
const connectToMongo = require('./db/connection');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use(express.json());

app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
