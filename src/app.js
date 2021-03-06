require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const router = require('./routes');
const tutorRouter = require('./routes/tutor');
const questionRouter = require('./routes/question');
const authRouter = require('./routes/auth');

const connectToMongo = require('./db/connection');
const cronServerChecking = require('./utils/cronServerChecking');
const logger = require('./utils/logger');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(' '),
  })
);
logger.info(`The current CORS origins are: ${process.env.CORS_ORIGIN}`);

const port = process.env.NODE_LOCAL_PORT;

app.set('view engine', 'ejs');

app.use(express.json());

app.use('/api', router);
app.use('/api/tutors', tutorRouter);
app.use('/api/questions', questionRouter);
app.use('/api/auth', authRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

logger.info('Starting the server checking cron job...');
cronServerChecking.start();

const server = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = { app, server };
