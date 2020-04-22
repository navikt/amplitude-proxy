const assert = require('assert');
const constants = require('../constants');
const cleanEventUrls = require('./clean-event-urls');
describe('clean-event-urls', function() {
  it('urls should be cleaned', function() {
    const cleanedEvents = cleanEventUrls([
      {
        event_properties: {
          url: 'https://example.com/initial/1000Ro2Fi',
          other: 'property',
        },
      }]);
    const expectedCleanedUrl = 'https://example.com/initial/' + constants.REDACTED;
    assert.strictEqual(cleanedEvents[0].event_properties.url, expectedCleanedUrl);
    assert.strictEqual(cleanedEvents[0].event_properties.other, 'property');
  });
});
