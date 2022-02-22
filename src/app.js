require('dotenv').config();
const express = require('express');
const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');
const authRouter = require('./routes/auth');

const connectToMongo = require('./db/connection');
const serverStatus = require('./utils/serverStatus');

require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);

const port = process.env.NODE_LOCAL_PORT;

app.set('view engine', 'ejs');

app.use(express.json());

app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);
app.use('/auth', authRouter);

console.log('Starting server status checking cronjob...');
serverStatus.start();

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = { app, server };
