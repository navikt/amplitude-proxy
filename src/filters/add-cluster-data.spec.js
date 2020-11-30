const assert = require('assert');
const getIngressException = require('../data/ingressException-path')
const ingressException = require(getIngressException())
const generateTestEvent = require('../../test-utils/generate-test-event');
const addClusterData = require('./add-cluster-data');
const getIngressDate = require('../data/lookup-function')
const constants = require('../constants');

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
    assert.strictEqual(outputEvents[0].event_properties.creationTimestamp, undefined);
  });

  it('should enrich data when existing and is localhost', function() {
    const testEvent = generateTestEvent('auto')
    testEvent.platform = 'https://localhost:3000';
    const outputEvents = addClusterData([testEvent], getIngressDate, ingressList);
    assert.strictEqual(outputEvents[0].platform, 'Web');
    assert.strictEqual(outputEvents[0].event_properties.namespace, 'local');
    assert.strictEqual(outputEvents[0].event_properties.hostname, 'localhost');
    assert.strictEqual(outputEvents[0].event_properties.context, 'local');
    assert.strictEqual(outputEvents[0].event_properties.pagePath, '/');
    assert.strictEqual(outputEvents[0].event_properties.creationTimestamp, undefined);
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
  it('should clean eventUrl', function() {
    const testEvent = generateTestEvent();
    testEvent.platform = 'http://localhost/foo/bar/3932934293939?query=param';
    const outputEvents = addClusterData([testEvent], () => {});
    console.log(outputEvents);
    assert.strictEqual(outputEvents[0].platform, 'Web');
    assert.strictEqual(outputEvents[0].event_properties.pagePath, '/foo/bar/' + constants.REDACTED);
  });
});
