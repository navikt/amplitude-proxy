const assert = require('assert');
const addGeoData = require('./add-geo-data');
const exampleEvent = require('../../examples/amplitude-event');
describe('add-tracking-options', function() {
  it('should add tracking options', function() {
    const cloneEvent = Object.assign({}, exampleEvent);
    let events = [cloneEvent, cloneEvent];
    const result = addGeoData(events, '155.55.51.185');
    assert.strictEqual(result.length, 2);
    result.forEach(event => {
      assert.strictEqual(typeof event.api_properties.tracking_options, 'object');
      assert.strictEqual(event.api_properties.tracking_options.city, 'Oslo');
      assert.notStrictEqual(event.user_agent, exampleEvent.user_agent);
      assert.notStrictEqual(event.os_version, exampleEvent.os_version);
    });
  });
});
