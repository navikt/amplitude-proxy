const assert = require('assert');
const moxios = require('moxios');
const paths = require('../paths');
const constants = require('../constants');
const collectRequestBody = require('../../test-utils/collect-request-body');
const collectRequestHeader = require('../../test-utils/collect-request-header');
const generateTestEvent = require('../../test-utils/generate-test-event');
const beforeRouteTest = require('../../test-utils/before-route-tests');
const collectRoute = require('./collect');
describe('collect', function() {

  let fastify;
  before(async () => {
    fastify = await beforeRouteTest(moxios)
  });
  after(() => {
    moxios.uninstall();
  });

  it('should work in happy case', async function() {
    moxios.wait(function() {
      let request = moxios.requests.mostRecent();
      assert.strictEqual(request.url, process.env.AMPLITUDE_URL + paths.HTTPAPI);
      const requestData = JSON.parse(request.config.data);
      const requestEvents = requestData.events;
      assert.strictEqual(requestEvents.length, 1);
      const firstEvent = requestEvents[0];
      assert.strictEqual(firstEvent.event_properties.proxyVersion, constants.UNKNOWN);
      assert.strictEqual(firstEvent.user_properties.referrer, 'https://www.nav.no/[redacted]');
      request.respondWith({
        status: 200,
        response: constants.SUCCESS,
      });
    });
    await fastify.inject({
      method: collectRoute.method,
      url: collectRoute.url,
      payload: collectRequestBody([generateTestEvent()]),
      headers: collectRequestHeader().headers,
    }).then((response) => {
      assert.strictEqual(response.body, constants.SUCCESS);
    });
  });

  it('should return 502 when proxying failes', async function() {
    moxios.wait(function() {
      let request = moxios.requests.mostRecent();
      assert.strictEqual(request.url, process.env.AMPLITUDE_URL + paths.HTTPAPI);
      const requestData = JSON.parse(request.config.data);
      const requestEvents = requestData.events;
      assert.strictEqual(requestEvents.length, 1);
      const firstEvent = requestEvents[0];
      assert.strictEqual(firstEvent.event_properties.proxyVersion, constants.UNKNOWN);
      assert.strictEqual(firstEvent.user_properties.referrer, 'https://www.nav.no/[redacted]');
      request.respondWith({
        status: 419,
        response: "gibberish",
      });
    });
    await fastify.inject({
      method: collectRoute.method,
      url: collectRoute.url,
      payload: collectRequestBody([generateTestEvent()]),
      headers: collectRequestHeader().headers,
    }).then((response) => { // the .end call will trigger the request
      assert.strictEqual(response.statusCode, 502);
    });
  });
  it('should return 400 when validation failes', async function() {
    await fastify.inject({
      method: collectRoute.method,
      url: collectRoute.url,
      payload: collectRequestBody([{foo:"bar"}]),
      headers: collectRequestHeader().headers,
    }).then((response) => {
      assert.strictEqual(response.statusCode, 400);
    });
  });
});
