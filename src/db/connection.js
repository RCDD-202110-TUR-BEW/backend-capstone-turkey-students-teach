const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isJest = process.env.IS_JEST;
let url = process.env.MONGODB_ATLAS_URL;
if (isJest) url = process.env.TEST_DB_URL;

const connectToMongo = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`Database connected: ${url}`);
  } catch (err) {
    logger.error(`Database connection error: ${err}`);
  }

  const db = mongoose.connection;

  // To handle errors after initial connection was established
  db.on('error', (err) => {
    logger.error(`Database connection error: ${err}`);
  });
};

module.exports = connectToMongo;
