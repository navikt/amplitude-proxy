const fs = require('fs');
const getIngressPath = require('./ingresses-path');
const axios = require('axios');
const logger = require('../utils/logger');
/**
 *
 * @param url
 * @returns {Promise<boolean>}
 */
module.exports = async function (remoteUrl) {
  const ingressesPath = getIngressPath();
  logger.info("Starting to fetch ingresses from: " + remoteUrl);
  try {
    const response = await axios.get(remoteUrl);
    if (!Array.isArray(response.data)) {
      logger.warn('fetch-ingresses: Reponse from ' + remoteUrl + ' is not an array.');
      return false;
    }

    if (response.data.length < 2000) {
      logger.warn('fetch-ingresses: Reponse from ' + remoteUrl + ' is to short just ' + response.data.length +
        ' need to be over 2000.');
      return false;
    }

    const responseString = JSON.stringify(response.data);
    if (fs.existsSync(ingressesPath)) {
      const oldData = await fs.readFileSync(ingressesPath, 'utf-8');
      if (oldData === responseString) {
        logger.info('Fetching ingresses, data not changed.');
        return true;
      }
    }
    logger.info('fetch-ingresses: Writing respponse data to: ' + ingressesPath);
    await fs.writeFileSync(ingressesPath, responseString, 'utf-8');
    const actualStoredData = await JSON.parse(fs.readFileSync(ingressesPath, 'utf-8'));

    if (!Array.isArray(actualStoredData)) {
      logger.warn('fetch-ingresses: Stored data failed, data is not an array.');
      return false;
    }
    if (actualStoredData.length !== response.data.length) {
      logger.warn('fetch-ingresses: Stored data failed, data have different length than response');
      return false;
    }

    logger.info('Everything is ok, updating `get-ingress-data`');
    delete require.cache[require.resolve('./get-ingress-data')]; // removing stored modules, they need to be reloaded
    return true;
  } catch {
    logger.info('Failed to fetch ingresses from: ' + remoteUrl)
    return false
  }
};
