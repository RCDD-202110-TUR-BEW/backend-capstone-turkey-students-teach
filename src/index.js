const app = require('./app');
const connectToMongo = require('./db/connection');

const port = process.env.NODE_LOCAL_PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});
