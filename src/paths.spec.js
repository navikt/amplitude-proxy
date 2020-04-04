const assert = require('assert');
const paths = require('./paths');
describe('paths', function() {
  it('all paths should start with slash', function() {
    Object.keys(paths).forEach(key => {
      assert.strictEqual(paths[key][0], '/');
    });
  });
  it('no paths should end with slash', function() {
    Object.keys(paths).forEach(key => {
      assert.notStrictEqual(paths[key].slice(-1), '/');
    });
  });
});
