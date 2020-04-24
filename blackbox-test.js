const assert = require('assert');
const axios = require('axios');
const paths = require('./src/paths');
const constants = require('./src/constants');
const generateTestEvent = require('./test-utils/generate-test-event');
const collectRequestHeader = require('./test-utils/collect-request-header');
const collectRequestBody = require('./test-utils/collect-request-body');
const YAML = require('yaml');
const fs = require('fs');
describe('test end to end', async () => {
  const DUMMY_CLIENT_ID = '0002BDF3F871B49F4F14ABDB13BD9B59';
  const COMMON_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
  const file = fs.readFileSync('./docker-compose.yml', 'utf8');
  const dockerCompose = YAML.parse(file);
  const port = dockerCompose.services.server.environment.PORT;
  const hostname = 'localhost';
  const baseUrl = 'http://' + hostname + ':' + port;
  const collectUrl = baseUrl + paths.COLLECT;
  const collectUrlDebug = collectUrl + '?debug=1';
  before(done => {
    console.log('Waiting on ' + baseUrl + paths.ITS_READY);
    const intervalHandle = setInterval(()=>{
      axios.get(baseUrl + paths.ITS_READY).then(d => {
        if(d.data === "ok"){
          done();
          clearInterval(intervalHandle);
        }
      });
    },1000)

  });

  it('happy case - ignored both', async () => {
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
