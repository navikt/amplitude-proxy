const assert = require('assert');
const createRequestLog = require('./create-request-log');

describe('create-request-log', function() {
  it('should create a function', function() {
    const log = createRequestLog("sdf","sadf","dsf","dsf", "dsf");
    assert.strictEqual(typeof log, "function");
    assert.strictEqual(typeof log("hello"), "object");
  });
});
