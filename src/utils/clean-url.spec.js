const assert = require('assert');
const constants = require('../constants');
const cleanUrl = require('./clean-url');
describe('clean-url', function() {
  it('urls should be cleaned', function() {
    const cleanedUrl = cleanUrl('https://example.com/initial/1000Ro2Fi');
    assert.strictEqual(cleanedUrl, 'https://example.com/initial/' + constants.REDACTED);
  });
  it('should remove 11 digit number from url', function () {
    const cleanedUrl = cleanUrl('https://example.com/person/12345678901');
    assert.strictEqual(cleanedUrl, 'https://example.com/person/' + constants.REDACTED)
  });
  it('should not fail on bad input', function() {
    const cleanedUrl = cleanUrl(undefined);
    assert.strictEqual(cleanedUrl, undefined);
  });
});
