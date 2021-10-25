const assert = require('assert');

const forwardEvents = require('./forward-events');
const paths = require('./paths');
const nock = require('nock');
const constants = require('./constants');

describe('forward-events', function() {

  afterEach(() => nock.cleanAll());

  it('should be forwarded', async () => {
    const events = [];
    const api_key = Math.random().toString(36).substr(2);
    const amplitudeUrl = 'http://localhost:4242';
    const scope = nock(amplitudeUrl).persist().post(paths.HTTPAPI, body => {
      assert.strictEqual(body.api_key, api_key);
      assert.deepStrictEqual(body.events, []);
      return body;
    }).reply(200, constants.SUCCESS);
    await forwardEvents(events, api_key, amplitudeUrl);
    scope.done();
  });

});
