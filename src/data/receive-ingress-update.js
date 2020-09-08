const logger = require('../utils/logger');
module.exports = async (ingressUpdate) => {
  logger.info('Received ' + ingressUpdate.ingresses.length + ' ingresses from collector ' + ingressUpdate.collector);
  return ingressUpdate;
}
