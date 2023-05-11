const axios = require('axios');
const paths = require('./paths');
const logger = require('./utils/logger');

module.exports = function (events, api_key, amplitudeUrl) {
  logger.info("# forward-events");
  const url = amplitudeUrl + paths.HTTPAPI;
  return axios.post(url, {
    api_key,
    events,
  });
};
