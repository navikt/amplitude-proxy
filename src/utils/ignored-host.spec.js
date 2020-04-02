const assert = require('assert');
const ignoredHost = require('./ignored-host');

describe('ignored-hosts', function() {

  it('should ignore localhost and heroku', function() {
    [
      'http://localhost:8080/sdfsa',
      'https://someapp.herokuapp.com',
      'https://localhost.example.com',
      'https://localhost/sdosda',
      'https://localhost',
    ].forEach(url => {
      assert.strictEqual(ignoredHost(url), true);
    });
    [
      'http://example.com',
    ].forEach(url => {
      assert.strictEqual(ignoredHost(url), false);
    });
  });

});
