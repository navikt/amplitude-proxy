const assert = require('assert');
const addGeoData = require('./add-geo-data');
const generateTestEvent = require('../../test-utils/generate-test-event');
describe('add-tracking-options', function() {
  it('should add tracking options', function() {
    let events = [generateTestEvent(), generateTestEvent()];
    const result = addGeoData(events, '155.55.51.185');
    assert.strictEqual(result.length, 2);
    result.forEach(event => {
      assert.strictEqual(event.city, 'Oslo');
      assert.notStrictEqual(event.user_agent, events[0].user_agent);
      assert.notStrictEqual(event.os_version, events[0].os_version);
    });
  });
});
