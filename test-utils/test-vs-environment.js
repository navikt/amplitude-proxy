const generateTestEvent = require('./generate-test-event');
const axios = require('axios');
const paths = require('../src/paths');
const collectRequestBody = require('../test-utils/collect-request-body');
const collectRequestHeader = require('../test-utils/collect-request-header');
const {COMMON_USER_AGENT} = require('./constants');

const baseUrl = 'https://amplitude.dev-gcp.nais.io';
const testVsEnvironment = async () => {
  const collectUrl = baseUrl + paths.COLLECT_AUTO + '?debug=1';
  const indexResult = await axios.get(baseUrl);
  if (indexResult.status === 200) {
    console.log('Når amplitude proxy på ' + baseUrl);
  }
  const result = await axios.post(
      collectUrl,
      collectRequestBody([generateTestEvent('auto')], 'default'),
      collectRequestHeader(COMMON_USER_AGENT),
  );
  console.log(result.data);
};

testVsEnvironment().then(() => console.log('Ferdig med å sende')).catch(error => {
  console.log(error.message, error.response.data);
});


