const fs = require('fs');
const path = require('path');
const axios = require('axios');
const logger = require('./utils/logger');
/**
 *
 * @param url
 * @returns {Promise<boolean>}
 */
module.exports = async function() {
  const remoteUrl = process.env.INGRESSES_URL;
  const cachedPath = path.resolve(__dirname, '..', 'cache', 'ingresses.json');
  const response = await axios.get(remoteUrl);
  const responseString = JSON.stringify(response.data);
  if (fs.existsSync(cachedPath)) {
    const oldData = await fs.readFileSync(cachedPath, 'utf-8');
    if (oldData === responseString) {
      logger.info("Fetching ingresses, data not changed.")
      return true;
    }
  }
  if (Array.isArray(response.data) && response.data.length > 2000) {
    await fs.writeFileSync(cachedPath, responseString, 'utf-8');
    const actual = await JSON.parse(fs.readFileSync(cachedPath, 'utf-8'));
    if (Array.isArray(actual) && actual > 2000 && actual.length === response.data.length) {
      logger.info("Fetching ingresses, data changed")
      delete require.cache[require.resolve('./get-ingress-data')]; // removing stored modules, they need to be reloaded
      return true;
    }
  }
  logger.warn("Fetching ingresses, something is wrong.")
  return false;
};
