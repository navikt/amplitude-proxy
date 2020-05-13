const assert = require('assert');
const generateTestEvent = require('../../test-utils/generate-test-event');
const addClusterData = require('./add-cluster-data');

describe('add-cluster-data', function() {

  it('should enrich data when existing', function() {
    const getIngressDataDummy = (url) => {
      return {
        someData: 'point',
        url: url,
      };
    };
    const testEvent = generateTestEvent()
    testEvent.platform = 'http://localhost/foo/bar?query=param';
    const outputEvents = addClusterData([testEvent], getIngressDataDummy);
    assert.strictEqual(outputEvents[0].platform, 'Web');
    assert.strictEqual(outputEvents[0].event_properties.someData, 'point');
    assert.strictEqual(outputEvents[0].event_properties.hostname, 'localhost');
    assert.strictEqual(outputEvents[0].event_properties.pagePath, '/foo/bar');
  });

  it('should ignore data when not fetched', function() {
    const testEvent = generateTestEvent()
    testEvent.platform = 'http://localhost/foo/bar?query=param';
    const outputEvents = addClusterData([testEvent], () => {});
    assert.strictEqual(outputEvents[0].platform, 'Web');
    assert.strictEqual(outputEvents[0].event_properties.someData, undefined);
    assert.strictEqual(outputEvents[0].event_properties.hostname, 'localhost');
    assert.strictEqual(outputEvents[0].event_properties.pagePath, '/foo/bar');
  });
});
