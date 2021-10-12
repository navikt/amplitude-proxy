const qs = require('querystring');
const {TEST_PROJECT_KEY} = require('./constants');

module.exports = (events, client) => {
  return qs.stringify({
    client: client || TEST_PROJECT_KEY,
    e: JSON.stringify(events),
  });
};

