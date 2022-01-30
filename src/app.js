const express = require('express');
require('dotenv').config();
const ConnectToMongo = require('./db/connection');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
  ConnectToMongo.getInstance();
});

module.exports = app;
