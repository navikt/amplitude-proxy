const axios = require('axios');
const assert = require('assert');
const paths = require('./paths');
const createAmplitudeServer = require('../test-utils/create-amplitude-server');
const logger = require("../src/utils/logger")
describe('Kafka bad case', async () => {
  const port = 9835;
  const hostname = '127.0.0.1';
  const baseUrl = 'http://' + hostname + ':' + port;

  let amplitudeProxyServer;

  before(async () => {
    amplitudeProxyServer = await createAmplitudeServer({'KAFKA_BROKERS': 'localhost.test:0001'},"kafka.bad.case");
    await amplitudeProxyServer.listen(port);
  });

  after(() => {
    amplitudeProxyServer.close(()=>{
      logger.info({msg:"AmplitudeProxyServer closed",name:"kafka.bad.case"});
    });
  });

  it('server should report unhealthy when Kafka Consumer encounters an error', async () => {
    axios.get(baseUrl + paths.ITS_ALIVE).catch((error) => {
      assert.strictEqual(error.response.status, 500);
    });
  });

  it('server should report not ready when ingresses consumes are less than 2000', async () => {
    axios.get(baseUrl + paths.ITS_READY).catch((error) => {
      assert.strictEqual(error.response.status, 503);
    });
  });

});
