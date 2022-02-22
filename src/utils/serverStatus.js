const cron = require('node-cron');
const axios = require('axios');

const options = {
  timezone: 'Europe/Istanbul',
};

const serverStatus = cron.schedule(
  '*/10 * * * * *', // every 10 sec
  async () => {
    const res = await axios.get('http://localhost:3000/');
    return res.status;
  },
  options
);

module.exports = serverStatus;
