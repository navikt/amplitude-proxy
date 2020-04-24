const assert = require('assert');
const generateTestEvent = require('./generate-test-event');

describe('generate-test-event', function() {
  it('should generate test event', function() {
    const ev1 = generateTestEvent();
    const ev2 = generateTestEvent();
    assert.notDeepEqual(ev1.uuid, ev2.uuid);
    assert.equal(ev1.device_id, ev1.device_id);
  });
});
