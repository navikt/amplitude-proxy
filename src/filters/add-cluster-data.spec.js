const assert = require('assert');
const getIngressException = require('../data/ingressException-path')
const ingressException = require(getIngressException())
const generateTestEvent = require('../../test-utils/generate-test-event');
const addClusterData = require('./add-cluster-data');
const getIngressDate = require('../data/lookup-function')

describe('add-cluster-data', function() {
  const ingressList = new Map()
  ingressException.forEach(data => ingressList.set(data.ingress, data))

  it('should enrich data when existing', function() {

    const testEvent = generateTestEvent('auto')
    testEvent.platform = 'https://www.nav.no/foo/bar?query=param';
    const outputEvents = addClusterData([testEvent], getIngressDate, ingressList);
    assert.strictEqual(outputEvents[0].platform, 'Web');
    assert.strictEqual(outputEvents[0].event_properties.namespace, 'enonic');
    assert.strictEqual(outputEvents[0].event_properties.hostname, 'www.nav.no');
    assert.strictEqual(outputEvents[0].event_properties.context, 'prod');
    assert.strictEqual(outputEvents[0].event_properties.pagePath, '/foo/bar');
  });

  it('should ignore data when not fetched', function() {
    const testEvent = generateTestEvent()
    testEvent.platform = 'http://localhost/foo/bar?query=param';
    const outputEvents = addClusterData([testEvent], () => {});
    assert.strictEqual(outputEvents[0].platform, 'Web');
    assert.strictEqual(outputEvents[0].event_properties.namespace, undefined);
    assert.strictEqual(outputEvents[0].event_properties.hostname, 'localhost');
    assert.strictEqual(outputEvents[0].event_properties.pagePath, '/foo/bar');
  });
});
