const server = require('./server');
const axios = require('axios');
const assert = require('assert');
const qs = require('querystring');
const exampleEvent = require('../examples/amplitude-event');
const paths = require('./paths');

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
  const port = 9832;
  const baseUrl = 'http://127.0.0.1:' + port;
  const collectUrl = baseUrl + paths.COLLECT + '?debug=1';

  process.env.AMPLITUDE_URL = 'https://api.amplitude.com';
  let fastify;
  before(async () => {
    fastify = await server(port);
  });

  after(async () => {
    await fastify.close();
  });

  it('server should receive and forward example event to amplitude', async () => {
    const result = await axios.post(collectUrl, qs.stringify(requestBody), config);
    if(result.data.code !==200){
      console.log(result.data);
    }
    assert.strictEqual(result.data.code, 200);
    assert.strictEqual(result.data.events_ingested, 1);

  });

  it('server should be ready when ready', async () => {
    const result1 = await axios.get(baseUrl + paths.ITS_ALIVE);
    assert.strictEqual(result1.status, 200);
    const result2 = await axios.get(baseUrl + paths.ITS_READY);
    assert.strictEqual(result2.status, 200);
  });
});
