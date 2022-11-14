const assert = require('assert');
const nock = require('nock');
const paths = require('../paths');
const constants = require('../constants');
const collectRequestBody = require('../../test-utils/collect-request-body');
const collectRequestHeader = require('../../test-utils/collect-request-header');
const generateTestEvent = require('../../test-utils/generate-test-event');
const createAmplitudeServer = require('../../test-utils/create-amplitude-server');
const {COMMON_USER_AGENT} = require('../../test-utils/constants');


const collectRoute = require('./collect');

describe('collect', function() {
  let amplitudeServer;

  before(async () => {
    amplitudeServer = await createAmplitudeServer({}, 'collect.spec');
    await amplitudeServer.ready();
  });

  after(async () => {
    await amplitudeServer.ready();
    await amplitudeServer.close();
  });

  afterEach(() => nock.cleanAll());

  it('should work in happy case', async function() {
    const scope = nock(process.env.AMPLITUDE_URL).persist().post(paths.HTTPAPI, body => {
      const requestEvents = body.events;
      assert.strictEqual(requestEvents.length, 1);
      const firstEvent = requestEvents[0];
      assert.strictEqual(firstEvent.event_properties.proxyVersion, constants.UNKNOWN);
      assert.strictEqual(firstEvent.user_properties.referrer, 'https://www.nav.no/[redacted]');
      assert.strictEqual(firstEvent.user_properties.initial_referrer, 'https://www.nav.no/initial/[redacted]');
      return body;
    }).reply(200, constants.SUCCESS);
    const response = await amplitudeServer.inject({
      method: collectRoute.method,
      url: collectRoute.url,
      payload: collectRequestBody([generateTestEvent()]),
      headers: collectRequestHeader(COMMON_USER_AGENT).headers,
    });
    console.log(response.body)
    assert.strictEqual(response.body, constants.SUCCESS);
    scope.done();
  });

  it('should return 419 when proxying failes', async function() {
    const scope = nock(process.env.AMPLITUDE_URL).persist().post(paths.HTTPAPI, body => {
      const requestEvents = body.events;
      assert.strictEqual(requestEvents.length, 1);
      const firstEvent = requestEvents[0];
      assert.strictEqual(firstEvent.event_properties.proxyVersion, constants.UNKNOWN);
      assert.strictEqual(firstEvent.user_properties.referrer, 'https://www.nav.no/[redacted]');
      assert.strictEqual(firstEvent.user_properties.initial_referrer, 'https://www.nav.no/initial/[redacted]');
      return body;
    }).reply(419, 'gibberish');

    const response = await amplitudeServer.inject({
      method: collectRoute.method,
      url: collectRoute.url,
      payload: collectRequestBody([generateTestEvent()]),
      headers: collectRequestHeader(COMMON_USER_AGENT).headers,
    });
    assert.strictEqual(response.statusCode, 419);
    scope.done();
  });

  it('should return 400 when validation failes', async function() {
    const response = await amplitudeServer.inject({
      method: collectRoute.method,
      url: collectRoute.url,
      payload: collectRequestBody([{foo: 'bar'}]),
      headers: collectRequestHeader(COMMON_USER_AGENT).headers,
    });
    assert.strictEqual(response.statusCode, 400);
  });
});
