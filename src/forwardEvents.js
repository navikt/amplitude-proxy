const axios = require('axios');
module.exports = function(events) {
  const url = process.env.AMPLITUDE_URL + '/2/httpapi';
  return axios.post(url, {
    api_key: process.env.AMPLITUDE_KEY,
    events,
  })
};
