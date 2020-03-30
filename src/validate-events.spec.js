const assert = require('assert');
const validateEvents = require('./validate-events');
const exampleEvent = require('../examples/amplitude-event');
describe('validate-events', function() {
  it('should not experience error on example event', function() {
    const cloneEvent = Object.assign({}, exampleEvent);
    const result = validateEvents([cloneEvent]);
    if (result.length > 0) {
      console.log(result);
    }
    assert.strictEqual(result.length, 0);
  });
  it('should fail when required property is not there', function() {
    const cloneEvent = Object.assign({}, exampleEvent);
    delete cloneEvent.event_type;
    const result = validateEvents([cloneEvent]);
    assert.strictEqual(result.length, 1);
  });
});
