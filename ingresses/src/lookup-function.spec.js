
const lookupFunction = require("./lookup-function");

const testUrl = 'https://www.w3schools.com/dsa/js/da/asdfa/js_break.asp';
const testMap = new Map();
testMap.set('https://www.w3schools.com/js/da', 'da');
testMap.set('https://www.w3schools.com', 'hellolowes');
const res = lookupFunction(testUrl, testMap);
console.log(res);

const res2 = lookupFunction("http://localhost/dfas", testMap);
console.log(res2);
