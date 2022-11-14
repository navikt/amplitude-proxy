const qs = require('querystring');
const {TEST_PROJECT_KEY} = require('./constants');

module.exports = (e, client) => {
  return qs.stringify({
    client: client || TEST_PROJECT_KEY,
    e: JSON.stringify(e),
    events: null
  });
};

