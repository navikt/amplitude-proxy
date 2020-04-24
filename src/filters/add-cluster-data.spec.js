const assert = require('assert');
const generateTestEvent = require('../../test-utils/generate-test-event');
const addClusterData = require('./add-cluster-data');

describe('add-cluster-data', function() {

  it('should enrich data when existing', function() {
    const dummyGetMapWithData = (url) => {
      return {
        someData: 'point',
        url: url,
      };
    };
    const testEvent = generateTestEvent()
    testEvent.platform = 'http://localhost/foo/bar';
    const outputEvents = addClusterData([testEvent], dummyGetMapWithData);
    assert.strictEqual(outputEvents[0].platform, 'Web');
    assert.strictEqual(outputEvents[0].event_properties.someData, 'point');
  });

  it('should ignore data when not fetched', function() {
    const testEvent = generateTestEvent()
    testEvent.platform = 'http://localhost/foo/bar';
    const outputEvents = addClusterData([testEvent], () => {});
    assert.strictEqual(outputEvents[0].platform, 'Web');
    assert.strictEqual(outputEvents[0].event_properties.someData, undefined);
  });
});
