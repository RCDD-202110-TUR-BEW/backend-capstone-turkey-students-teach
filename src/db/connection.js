const mongoose = require('mongoose');

require('dotenv').config();

const isJest = process.env.IS_JEST;
let url = process.env.MONGODB_ATLAS_URL;
if (isJest) url = process.env.TEST_DB_URL;

const connectToMongo = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // eslint-disable-next-line no-console
    console.log('Database connected: ', url);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Database connection error: ', err);
  }

  const db = mongoose.connection;

  // To handle errors after initial connection was established
  db.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('Database connection error: ', err);
  });
};

module.exports = connectToMongo;
