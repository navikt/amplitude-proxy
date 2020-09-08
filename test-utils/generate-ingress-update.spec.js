const assert = require('assert');
const generateIngressUpdate = require('./generate-ingress-update');

describe('generate-test-event', function() {
  it('should generate test event', function() {
    const ev1 = generateIngressUpdate();
    const ev2 = generateIngressUpdate();
    assert.notDeepEqual(ev1.uid, ev2.uid);
  });
});
