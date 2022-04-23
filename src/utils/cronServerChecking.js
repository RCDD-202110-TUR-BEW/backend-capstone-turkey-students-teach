const cron = require('node-cron');
const fetch = require('cross-fetch');
const logger = require('./logger');

const options = {
  timezone: 'Europe/Istanbul',
};

const serverChecking = cron.schedule(
  '*/15 * * * *', // At every 15th minute.
  async () => {
    try {
      const res = await fetch('https://studentsteach.re-coded.com/api');

      if (res.status >= 400) {
        return logger.error(
          `CRON: Server bad response with the status code: ${res.status}`
        );
      }
      return logger.info(
        `CRON: The latest server status call returned the status code: ${res.status}`
      );
    } catch (e) {
      return logger.error(`CRON: an error occurred while calling the server.`);
    }
  },
  options
);

module.exports = serverChecking;
