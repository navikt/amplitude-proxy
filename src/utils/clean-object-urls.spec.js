const assert = require('assert');
const constants = require('../constants');
const cleanObjectUrls = require('./clean-object-urls');
describe('clean-object-urls', function() {
  it('urls in an object should be cleaned', function() {
    const cleanedObjects = cleanObjectUrls({
      url: 'https://example.com/initial/1000Ro2Fi',
      referrer: 'https://example.com/person/12345678901',
      other: 'prop',
      numb: 123,
      nesteObject : {
        initial_referrer: 'https://example.com/person/12345678901',
        pagePath: 'person/12345678901',
      },
      pagePath: '/initial/12345678901',
      notUrl: '/initial/12345678901',
    });
    assert.strictEqual(cleanedObjects.url, 'https://example.com/initial/' + constants.REDACTED);
    assert.strictEqual(cleanedObjects.referrer, 'https://example.com/person/' + constants.REDACTED);
    assert.strictEqual(cleanedObjects.other, 'prop');
    assert.strictEqual(cleanedObjects.numb, 123);
    assert.strictEqual(cleanedObjects.nesteObject.initial_referrer, 'https://example.com/person/' + constants.REDACTED)
    assert.strictEqual(cleanedObjects.pagePath, '/initial/' + constants.REDACTED)
    assert.strictEqual(cleanedObjects.nesteObject.pagePath, 'person/' + constants.REDACTED)
    assert.strictEqual(cleanedObjects.notUrl, '/initial/12345678901')
  });
});
