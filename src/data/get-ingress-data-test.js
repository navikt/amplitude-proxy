const lookupFunction = require('./lookup-function');
const logger = require('../utils/logger');
const entryMap = new Map();
/**
 * This map will be staic and not recalculated untill server restart.
 */
logger.info("IngressMap is loaded with " + entryMap.size + " entries.");
const getIngressDataTest = (url, ingresses) => {

  ingresses.forEach(entry => {
    entryMap.set(entry.ingress, entry);
  });

  return lookupFunction(url, entryMap);
};

module.exports = getIngressDataTest;
