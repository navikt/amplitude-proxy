const assert = require('assert');
const constants = require('../constants');
const cleanUrl = require('./clean-url');
describe('clean-url', function() {
  it('urls should be cleaned', function() {
    const cleanedUrl = cleanUrl('https://example.com/initial/1000Ro2Fi/nav123456789/test123456');
    assert.strictEqual(cleanedUrl, 'https://example.com/initial/' + constants.REDACTED + '/nav123456789/test123456');
  });
  it('should remove 11 digit number from url', function () {
    const cleanedUrl = cleanUrl('https://example.com/person/12345678901/nav123456/test123456');
    assert.strictEqual(cleanedUrl, 'https://example.com/person/' + constants.REDACTED + '/nav123456/test123456')
  });
  it('should not fail on bad input', function() {
    const cleanedUrl = cleanUrl(undefined);
    assert.strictEqual(cleanedUrl, undefined);
  });
});
