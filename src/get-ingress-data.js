const allEntries = require('../cache/ingresses.json');
const lookupFunction = require('./lookup-function');
const logger = require('./utils/logger');
const entryMap = new Map();
/**
 * This map will be staic and not recalculated untill server restart.
 */
allEntries.forEach(entry => {
  entryMap.set(entry.ingress, entry);
});
logger.info("Entrymap loaded with " + entryMap.size + " entries.");
const getIngressData = (url) => {
  return lookupFunction(url, entryMap);
};

module.exports = getIngressData;
