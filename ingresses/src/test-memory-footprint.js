const startTime = new Date();
const entryMap = require('./get-entry-map');
const lookupFunction = require('./lookup-function');
const fs = require('fs');

const contents = fs.readFileSync('./tmp/test-urls.txt', 'utf8');

let matched = 0;
let uniq = new Map();
let orphants = []
contents.split('\n').forEach(url => {
  const res = lookupFunction(url, entryMap);
  if (res) {
    matched++;
    uniq.set(res.appname, res);
  } else {
    orphants.push(url)
  }
});

const endTime = new Date() - startTime;
fs.writeFileSync('./tmp/_orphants.json', JSON.stringify(orphants));
fs.writeFileSync('./tmp/_matched.json', JSON.stringify(Object.fromEntries(uniq)));
console.log('endTime', endTime + 'ms');
console.log('matched', matched + ' entries.');
console.log('unique', uniq.size);

