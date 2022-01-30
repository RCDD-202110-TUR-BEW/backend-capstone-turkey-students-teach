const mongoose = require('mongoose');

const url = process.env.MONGODB_ATLAS_URL;

class Connection {
  constructor() {
    mongoose
      .connect(url, { useNewUrlParser: true })
      // eslint-disable-next-line no-console
      .then(() => console.info('MongoDB connection established successfully'))
      .catch((e) =>
        // eslint-disable-next-line no-console
        console.error(`MongoDB connection failed with error: ${e}`)
      );

    const db = mongoose.connection;

    // To handle errors after initial connection was established
    db.on('error', (e) => {
      // eslint-disable-next-line no-console
      console.error(`Database connection error: ${e}`);
    });
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Connection();
    return this.instance;
  }

  static disconnect() {
    if (this.instance) {
      mongoose.connection.close();
      this.instance = null;
      // eslint-disable-next-line no-console
      console.info('DB connection disconnected successfully');
    }
  }
}

module.exports = Connection;
