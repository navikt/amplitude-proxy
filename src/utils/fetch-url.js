const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const logger = require('./logger');
/**
 *
 * @param url
 * @returns {Promise<String>}
 */
module.exports = async function(url) {
  const filename = crypto.createHash('md5').update(url).digest('hex');
  const cachedPath = path.resolve(__dirname, '..', '..', 'cache', filename);
  if (!fs.existsSync(cachedPath)) {
    const response = await axios.get(url);
    logger.info('Fetched and cached: ' + url + ' to ' + cachedPath);
    await fs.writeFileSync(cachedPath, response.data, 'utf-8');
  }
  return fs.readFileSync(cachedPath, 'utf-8');
};
