const assert = require('assert');
const normalizeEvents = require('./normalize-events');
const exampleEvent = require('../examples/amplitude-event');
describe('normalize-events', function() {
  it('should add tracking options', function() {
    const cloneEvent = Object.assign({}, exampleEvent);
    let events = [cloneEvent, cloneEvent]
    events[0].user_properties.initial_referrer = 'https://www.nav.no/initial/1000Ro2Fi'
    const result = normalizeEvents(events, '155.55.51.185');
    assert.strictEqual(result.length, 2);
    result.forEach(event => {
      assert.strictEqual(typeof event.api_properties.tracking_options, 'object');
      assert.strictEqual(event.api_properties.tracking_options.city, 'Oslo');
      assert.notStrictEqual(event.user_agent, exampleEvent.user_agent);
      assert.notStrictEqual(event.os_version, exampleEvent.os_version);

      assert.strictEqual(event.user_properties.initial_referrer, 'https://www.nav.no/initial/masked-id');
      assert.strictEqual(event.user_properties.referrer, 'https://www.nav.no/masked-id');
    });
  });
});
