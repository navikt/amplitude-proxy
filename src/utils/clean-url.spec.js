const assert = require('assert');
const constants = require('../constants');
const cleanUrl = require('./clean-url');
describe('clean-url', function() {
  it('urls should be cleaned', function() {
    const cleanedUrl = cleanUrl('https://example.com/initial/1000Ro2Fi');
    assert.strictEqual(cleanedUrl, 'https://example.com/initial/' + constants.REDACTED);
  });
});
