const assert = require('assert');
const axios = require('axios');
const moxios = require('moxios');
const forwardEvents = require('./forward-events');
const paths = require('./paths');
describe('forward-events', function() {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should be forwarded', function(done) {
    const events = [];
    const api_key = 'cbad9041839e9b37e65453ef99127c2f';
    const amplitudeUrl = 'http://localhost:4242';
    moxios.wait(function() {
      let request = moxios.requests.mostRecent();
      assert.strictEqual(request.url, amplitudeUrl + paths.HTTPAPI);
      assert.strictEqual(request.config.method, 'post');
      const body = JSON.parse(request.config.data);
      assert.strictEqual(body.api_key, api_key);
      assert.deepStrictEqual(body.events, []);
      request.respondWith({
        status: 200,
        response: 'success',
      }).then(() => done());
    });
    forwardEvents(events, api_key, amplitudeUrl);
  });

});
