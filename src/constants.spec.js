const assert = require('assert');
const constants = require('./constants');
describe('constants', function() {
  it('constants should be upper case', function() {
    Object.keys(constants).forEach(key => {
      assert.strictEqual(key, key.toUpperCase());
    });
  });
});
