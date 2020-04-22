const assert = require('assert');
const constants = require('../constants');
const cleanObjectUrls = require('./clean-object-urls');
describe('clean-object-urls', function() {
  it('urls in an object should be cleaned', function() {
    const cleanedObjects = cleanObjectUrls({
      url: 'https://example.com/initial/1000Ro2Fi',
      other: 'prop',
      numb: 123,
    });
    assert.strictEqual(cleanedObjects.url, 'https://example.com/initial/' + constants.REDACTED);
    assert.strictEqual(cleanedObjects.other, 'prop');
    assert.strictEqual(cleanedObjects.numb, 123);
  });
});
