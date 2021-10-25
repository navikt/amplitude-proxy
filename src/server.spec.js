const axios = require('axios');
const assert = require('assert');
const generateTestEvent = require('../test-utils/generate-test-event');
const collectRequestHeader = require('../test-utils/collect-request-header');
const collectRequestBody = require('../test-utils/collect-request-body');
const createAmplitudeServer = require('../test-utils/create-amplitude-server');
const paths = require('./paths');
const constants = require('./constants');

const logger = require('../src/utils/logger');
const {COMMON_USER_AGENT} = require('../test-utils/constants');
const {
  port,
  hostname,
  baseUrl,
  collectUrlDebug,
  collectAutoUrlDebug,
} = require('../test-utils/test-paths');

describe('server tests', async () => {

  let amplitudeProxyServer;

  before(async () => {
    amplitudeProxyServer = await createAmplitudeServer({}, 'server.spec');
    await amplitudeProxyServer.listen(port);
  });

  after(() => {
    amplitudeProxyServer.close(() => {
      logger.info({msg: 'AmplitudeProxyServer closed', name: 'server.spec'});
    });
  });

  it('collect endpoint should block bot traffic', async () => {
    const result = await axios.post(
        collectUrlDebug,
        collectRequestBody([generateTestEvent()]),
        collectRequestHeader(),
    );
    assert.strictEqual(result.data, constants.IGNORED);
    assert.strictEqual(result.status, 200);
  });

  it('collect-auto endpoint should block bot traffic', async () => {
    const result = await axios.post(
        collectAutoUrlDebug,
        collectRequestBody([generateTestEvent('auto')], 'default'),
        collectRequestHeader(),
    );
    assert.strictEqual(result.data, constants.IGNORED);
    assert.strictEqual(result.status, 200);
  });

  it('collect-auto endpoint should block dev traffic', async () => {
    const TestEvent = generateTestEvent('auto');
    TestEvent.platform = 'https://arbeidsgiver.heroku/min-side-arbeidsgiver/asdompage/asdfas?fasd=ddds';
    const result = await axios.post(
        collectAutoUrlDebug,
        collectRequestBody([TestEvent], 'default'),
        collectRequestHeader(COMMON_USER_AGENT),
    );
    assert.strictEqual(result.data, constants.SUCCESS);
    assert.strictEqual(result.status, 200);
  });

  it('should receive and forward example event to amplitude', async () => {
    const result = await axios.post(
        collectUrlDebug,
        collectRequestBody([generateTestEvent()]),
        collectRequestHeader(COMMON_USER_AGENT),
    );
    if (result.data.code !== 200) {
      console.error(result.data);
    }
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.data.code, 200);
    assert.strictEqual(result.data.events_ingested, 1);
  });

  it('should receive and forward example event auto to amplitude', async () => {
    const result = await axios.post(
        collectAutoUrlDebug,
        collectRequestBody([generateTestEvent('auto')], 'default'),
        collectRequestHeader(COMMON_USER_AGENT),
    );
    if (result.data.code !== 200) {
      console.error(result.data);
    }
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.data.code, 200);
    assert.strictEqual(result.data.events_ingested, 1);
  });

  it('should serve libraries', async () => {
    const SDK_URL = baseUrl + paths.JS_SDK;
    const result1 = await axios.get(SDK_URL);
    assert.strictEqual(result1.status, 200);
    const found1 = result1.data.indexOf(hostname + ':' + port + paths.COLLECT);
    assert.notStrictEqual(found1, -1);

    // Should be fetched same way second time
    const result2 = await axios.get(SDK_URL);
    assert.strictEqual(result2.status, 200);
    const found2 = result2.data.indexOf(hostname + ':' + port + paths.COLLECT);
    assert.notStrictEqual(found2, -1);
    assert.deepEqual(result1.data, result2.data);
  });

  it('server should report alive when no kafka error happens', async () => {
    const result = await axios.get(baseUrl + paths.ITS_ALIVE);
    assert.strictEqual(result.status, 200);
  });

  it('server should report ready when successfully retrieving 4000 ingresses', (done) => {
    let tries = 0;
    const intervalHandle = setInterval(() => {
      tries++
      axios.get(baseUrl + paths.ITS_READY).then((result) => {
        assert.strictEqual(result.status, 200);
        clearInterval(intervalHandle);
        done()
      }).catch(e => {
        logger.error({msg: e.message, name: 'server.spec'});
      })
      if (tries > 9) {
        clearInterval(intervalHandle);
        done()
      }
    }, 500);
  }).timeout(5000);

});
