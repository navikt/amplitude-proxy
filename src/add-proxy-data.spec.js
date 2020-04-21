const assert = require('assert');
const exampleEvent = require('../examples/amplitude-event');
const addProxyData = require('./add-proxy-data');
const constants = require('./constants');
describe('add-proxy-data', function() {
  it('should work with simple', function() {
    const testEvent = JSON.parse(JSON.stringify(exampleEvent));
    const outputEvents = addProxyData([testEvent], 'v1.2.3');
    assert.strictEqual(outputEvents[0].event_properties.proxyVersion, 'v1.2.3');
  });
  it('should work with full paths', function() {
    const testEvent = JSON.parse(JSON.stringify(exampleEvent));
    const outputEvents = addProxyData([testEvent],
        'docker.pkg.github.com/navikt/amplitude-proxy/amplitude-proxy:29ecd20d9febeec228a4f2cb42d83e4243818994');
    assert.strictEqual(outputEvents[0].event_properties.proxyVersion, '29ecd20d9febeec228a4f2cb42d83e4243818994');
  });
  it('should work with unknown', function() {
    const testEvent = JSON.parse(JSON.stringify(exampleEvent));
    [null, undefined, {}, []].forEach(val => {
      const outputEvents = addProxyData([testEvent], val);
      assert.strictEqual(outputEvents[0].event_properties.proxyVersion, constants.UNKNOWN);
    });
  });
  it('should work with minimal event data', function() {
    const testEvent = {};
    const outputEvents = addProxyData([testEvent], 'v1.2.3');
    assert.strictEqual(outputEvents[0].event_properties.proxyVersion, 'v1.2.3');

  });
});
