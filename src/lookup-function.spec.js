
const assert = require('assert');
const lookupFunction = require("./lookup-function");
const testUrl = 'https://www.w3schools.com/dsa/js/da/asdfa/js_break.asp';
const testMap = new Map();
testMap.set('https://www.w3schools.com/js/da', 'da');
testMap.set('https://www.w3schools.com', 'hellolowes');

describe('loopup-function', function() {
  it('should handle finding a result', function() {
    const res = lookupFunction(testUrl, testMap);
    assert.strictEqual(res, 'hellolowes');

  });
  it('should return undenfined if no result', function() {
    const res = lookupFunction("http://localhost/dfas", testMap);
    assert.strictEqual(res, undefined);
  });
});







