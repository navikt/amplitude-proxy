const axios = require('axios');
const assert = require('assert');
const paths = require('./paths');
const createAmplitudeServer = require('../test-utils/create-amplitude-server');
const getIngressExceptionPath = require('./data/ingressException-path');
const ingressExceptions = require(getIngressExceptionPath());
const logger = require('../src/utils/logger');
const {
  port,
  baseUrl,
} = require('../test-utils/test-paths');

describe('server - kafka disabled', async () => {
  const testName = 'server - kafka disabled';

  let amplitudeProxyServer;

  before(async () => {
    amplitudeProxyServer = await createAmplitudeServer({KAFKA_DISABLED: 'true'}, testName);
    await amplitudeProxyServer.listen(port);
  });

  after(() => {
    amplitudeProxyServer.close(() => {
      logger.info({msg: 'AmplitudeProxyServer closed', name: testName});
    });
  });

  it('server should report healthy right away', async () => {
    const response = await axios.get(baseUrl + paths.ITS_ALIVE);
    assert.strictEqual(response.status, 200);
  });

  it('server should report ready right away', async () => {
    const response = await axios.get(baseUrl + paths.ITS_READY);
    assert.strictEqual(response.status, 200);
  });

  /**
   * @todo add more tests
   */
  it('ingresses should be equal the resource list', async () => {
    const map = amplitudeProxyServer.ingresses;
    assert.strictEqual(map.size, ingressExceptions.length);
    assert.strictEqual(map.size > 0, true);
  });

});
