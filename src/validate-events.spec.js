const assert = require('assert');
const validateEvents = require('./validate-events');
const generateTestEvent = require('../test-utils/generate-test-event');
describe('validate-events', function() {
  it('should not experience error on example event', function() {
    const event = generateTestEvent();
    const result = validateEvents([event]);
    if (result.length > 0) {
      console.log(result);
    }
    assert.strictEqual(result.length, 0);
  });
  it('should fail when required property is not there', function() {
    const event = generateTestEvent();
    delete event.event_type;
    const result = validateEvents([event]);
    assert.strictEqual(result.length, 1);
  });
});
