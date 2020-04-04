const assert = require('assert');
const axios = require('axios');
const waitOn = require('wait-on');
const paths = require('../src/paths');
const constants = require('../src/constants');
const exampleEvent = require('../examples/amplitude-event');
const collectRequestHeader = require('../test-utils/collect-request-header');
const collectRequestBody = require('../test-utils/collect-request-body');

describe('test end to end', async () => {
  const DUMMY_CLIENT_ID = '0002BDF3F871B49F4F14ABDB13BD9B59';
  const COMMON_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
  const port = 4243; // @see docker-compose.yaml
  const hostname = '127.0.0.1';
  const baseUrl = 'http://' + hostname + ':' + port;
  const collectUrl = baseUrl + paths.COLLECT;
  const collectUrlDebug = collectUrl + '?debug=1';
  before(async done => {
    await waitOn({
      resources: [
        baseUrl + paths.ITS_READY,
      ],
    },done);
  });

  it('happy case - ignored both', async () => {
    const result = await axios.post(
        collectUrlDebug,
        collectRequestBody([exampleEvent]),
        collectRequestHeader(),
    );
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.data, constants.IGNORED);
  });
  it('happy case - success', async () => {
    const inputBody = collectRequestBody([exampleEvent], DUMMY_CLIENT_ID);
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
