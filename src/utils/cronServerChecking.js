const cron = require('node-cron');
const fetch = require('cross-fetch');

const options = {
  timezone: 'Europe/Istanbul',
};

const serverChecking = cron.schedule(
  '*/15 * * * *', // At every 15th minute.
  async () => {
    try {
      const res = await fetch('http://localhost:3000/');

      if (res.status >= 400) {
        return console.error(
          `CRON: Server bad response with the status code: ${res.status}`
        );
      }
      return console.info(
        `CRON: The latest server status call returned the status code: ${res.status}`
      );
    } catch (e) {
      return console.error(`CRON: an error occurred while calling the server.`);
    }
  },
  options
);

module.exports = serverChecking;
