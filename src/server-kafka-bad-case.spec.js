const server = require('./server');
const axios = require('axios');
const assert = require('assert');
const client = require('prom-client');
const paths = require('./paths');
const constants = require('./constants');
const nodemonConfig = require('../nodemon-invalid-kafka-broker.json');

describe('Kafka bad case', async () => {
  const port = 9835;
  const hostname = '127.0.0.1';
  const baseUrl = 'http://' + hostname + ':' + port;

  let amplitudeProxyServer;
  before(async () => {
    Object.keys(nodemonConfig.env).forEach(key => {
        process.env[key] = nodemonConfig.env[key];
    });
    process.env.NODE_ENV = constants.TEST;
    try {
      client.register.clear();
      amplitudeProxyServer = await server();
      await amplitudeProxyServer.listen(port);
    } catch (e) {
      console.error('FATAL ERROR: ' + e.message);
      process.exit(1);
    }
  });

  after(async () => {
    await amplitudeProxyServer.close();
  });

  it('server should report unhealthy when Kafka Consumer encounters an error', async () => {
    axios.get(baseUrl + paths.ITS_ALIVE).catch((error) => {
      assert.strictEqual(error.response.status, 500)
    })
  });

  it('server should report not ready when ingresses consumes are less than 2000', async () => {
    axios.get(baseUrl + paths.ITS_READY).catch((error) => {
      assert.strictEqual(error.response.status, 503);
    });
  })

});
