const assert = require('assert');
const getTrackingOptions = require('./get-tracking-options');
describe('get tracking options', function() {
  it('should handle a valid ip', function() {
    const trackingOptions = getTrackingOptions('155.55.51.185');
    assert.strictEqual(typeof trackingOptions, 'object');
    assert.strictEqual(trackingOptions.city, 'Oslo');
    assert.strictEqual(trackingOptions.country, 'NO');
  });
  it('should not fail hard', function() {
    const trackingOptions = getTrackingOptions('155.55.51.x');
    assert.strictEqual(Object.keys(trackingOptions).length, 3);
    Object.keys(trackingOptions).forEach(key => {
      assert.strictEqual(trackingOptions[key], false);
    });
  });
});
