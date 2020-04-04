const startTime = new Date();
const getIngressData = require('../../src/data/get-ingress-data');
const fs = require('fs');
const path = require('path');
const parentDir = path.resolve(__dirname, '..');
const contents = fs.readFileSync(parentDir + '/tmp/test-urls.txt', 'utf8');

let matched = 0;
let uniq = new Map();
let orphants = [];
const testUrls = contents.trim().split('\n');
testUrls.forEach(url => {
  const res = getIngressData(url);
  if (res) {
    matched++;
    uniq.set(res.app, res);
  } else {
    orphants.push(url);
  }
});

const runtime = new Date() - startTime;
fs.writeFileSync(parentDir + '/tmp/_orphants.json', JSON.stringify(orphants));
fs.writeFileSync(parentDir + '/tmp/_matched.json', JSON.stringify(Object.fromEntries(uniq)));
console.log('runtime', runtime + 'ms');
console.log('matched', matched + ' of ' + testUrls.length + ' entries.');
console.log('unique', uniq.size);

