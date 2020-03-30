const server = require('./server');
const axios = require('axios');
const assert = require('assert');
const qs = require('querystring');
const exampleEvent = require('../examples/amplitude-event');
const paths = require('./paths');
const constants = require('./constants');
describe('test end to end', async () => {

  const requestBody = {
    client: '55477baea93c5227d8c0f6b813653615',
    e: JSON.stringify([exampleEvent]),
  };
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  const COMMON_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
  const port = 9832;
  const hostname = '127.0.0.1';
  const baseUrl = 'http://' + hostname + ':' + port;
  const collectUrl = baseUrl + paths.COLLECT + '?debug=1';

  process.env.AMPLITUDE_URL = 'https://api.amplitude.com';
  let fastify;
  before(async () => {
    fastify = await server(port);
  });

  after(async () => {
    await fastify.close();
  });
  it('should block bot traffic', async () => {
    const clonedConfig = Object.assign({}, config);
    const result = await axios.post(collectUrl, qs.stringify(requestBody), clonedConfig);
    assert.strictEqual(result.data, constants.IGNORED);
    assert.strictEqual(result.status, 200);
  });
  it('should receive and forward example event to amplitude', async () => {
    const clonedConfig = Object.assign({}, config);
    clonedConfig.headers['user-agent'] = COMMON_USER_AGENT;
    const result = await axios.post(collectUrl, qs.stringify(requestBody), clonedConfig);
    if (result.data.code !== 200) {
      console.error(result.data);
    }
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.data.code, 200);
    assert.strictEqual(result.data.events_ingested, 1);
  });

  it('server should be ready when ready', async () => {
    const result1 = await axios.get(baseUrl + paths.ITS_ALIVE);
    assert.strictEqual(result1.status, 200);
    const result2 = await axios.get(baseUrl + paths.ITS_READY);
    assert.strictEqual(result2.status, 200);
  });

  it('should serve liberaries', async () => {
    const result1 = await axios.get(baseUrl + paths.JS_SDK);
    assert.strictEqual(result1.status, 200);
    const found1 = result1.data.indexOf(hostname + ':' + port + paths.COLLECT);
    assert.notStrictEqual(found1, -1);

    // Should be fetched same way second time
    const result2 = await axios.get(baseUrl + paths.JS_SDK);
    assert.strictEqual(result2.status, 200);
    const found2 = result2.data.indexOf(hostname + ':' + port + paths.COLLECT);
    assert.notStrictEqual(found2, -1);
    assert.deepEqual(result1.data, result2.data);
  });
});
