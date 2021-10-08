const assert = require('assert');
const axios = require('axios');
const paths = require('./src/paths');
const constants = require('./src/constants');
const generateTestEvent = require('./test-utils/generate-test-event');
const collectRequestHeader = require('./test-utils/collect-request-header');
const collectRequestBody = require('./test-utils/collect-request-body');
const YAML = require('yaml');
const fs = require('fs');
const {COMMON_USER_AGENT} = require('./test-utils/constants');

/**
 * Test run agains the built docker container. Simulating a "as real as it gets" scenario.
 */
describe('test end to end', async () => {

  const DUMMY_CLIENT_ID = '0002BDF3F871B49F4F14ABDB13BD9B59';
  const file = fs.readFileSync('./docker-compose.yml', 'utf8');
  const dockerCompose = YAML.parse(file);
  const port = dockerCompose.services.server.environment.PORT;
  const hostname = 'localhost';
  const baseUrl = 'http://' + hostname + ':' + port;
  const collectUrl = baseUrl + paths.COLLECT;
  const collectUrlDebug = collectUrl + '?debug=1';

  it('happy case - ignored bot traffic', async () => {
    const result = await axios.post(
        collectUrlDebug,
        collectRequestBody([generateTestEvent()]),
        collectRequestHeader(),
    );
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.data, constants.IGNORED);
  });


  it('happy case - success', async () => {
    const inputBody = collectRequestBody([generateTestEvent()], DUMMY_CLIENT_ID);
    const result = await axios.post(
        collectUrlDebug,
        inputBody,
        collectRequestHeader(COMMON_USER_AGENT),
    );
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.data.method, 'POST');
    assert.strictEqual(result.data.path, paths.HTTPAPI);
    const forwardedBody = JSON.parse(result.data.body);
    assert.strictEqual(DUMMY_CLIENT_ID, forwardedBody.api_key);
  });

});
