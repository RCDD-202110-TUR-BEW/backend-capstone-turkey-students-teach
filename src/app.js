require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');
const authRouter = require('./routes/auth');

const connectToMongo = require('./db/connection');

require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.NODE_LOCAL_PORT;

app.set('view engine', 'ejs');

app.use(express.json());

app.use('/', router);
app.use('/tutors', tutorRouter);
app.use('/questions', questionRouter);
app.use('/auth', authRouter);

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = { app, server };
