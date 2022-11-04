const assert = require('assert');
const addGeoData = require('./add-geo-data');
const generateTestEvent = require('../../test-utils/generate-test-event');
describe('add-tracking-options', function() {
  
  it('should add tracking options', function() {
    const events = [generateTestEvent(), generateTestEvent()];
    const result = addGeoData(events, '155.55.51.185');
    console.log(events)
    assert.strictEqual(result.length, 2);
    result.forEach(event => {
      assert.strictEqual(event.city, 'Oslo');
      assert.notStrictEqual(event.user_agent, events[0].user_agent);
      assert.notStrictEqual(event.os_version, events[0].os_version);
    });
  });

  it('should not add tracking options', function() {
    const eventsWithNoIp = [generateTestEvent(), generateTestEvent()];
    eventsWithNoIp.forEach((e) => {
      e.api_properties = {
        tracking_options: {
          ip_address: false
        }
      }
    })
    const result = addGeoData(eventsWithNoIp, undefined);
    assert.strictEqual(result.length, 2);
    result.forEach(event => {
      assert.strictEqual(event.city, null);
      assert.strictEqual(event.country, null);
      assert.strictEqual(event.location_lat, null);
      assert.strictEqual(event.location_lng, null);
      assert.strictEqual(event.region, null);
      assert.notStrictEqual(event.user_agent, eventsWithNoIp[0].user_agent);
      assert.notStrictEqual(event.os_version, eventsWithNoIp[0].user_agent);
    });
  });
});
