const allEntries = require('../tmp/all.json');

const entryMap = new Map();

allEntries.forEach(entry => {
  entryMap.set(entry.ingress, entry);
});

module.exports = entryMap;
