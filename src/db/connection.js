require('dotenv').config();

const mongoose = require('mongoose');

const url = process.env.MONGODB_ATLAS_URL;

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
