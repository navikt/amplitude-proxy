const axios = require('axios');
const paths = require('./paths');
module.exports = function(events, api_key, amplitudeUrl) {
  const url = amplitudeUrl + paths.HTTPAPI;
  return axios.post(url, {
    api_key,
    events,
  });
};
