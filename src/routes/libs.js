const fetchUrl = require('../utils/fetch-url');
const cached = {};
const logger = require('../utils/logger');

const handler = async function(req, reply) {
  const url = 'https://cdn.amplitude.com' + req.raw.url;
  const hostname = req.hostname;
  try {
    if (!cached[hostname]) {
      const content = await fetchUrl(url);
      cached[hostname] = content.replace('api.amplitude.com', req.hostname + '/collect');
    }
    reply.header('Content-Type', 'text/javascript; charset=utf-8').send(cached[hostname]);
  } catch (e) {
    logger.error(e.message)
    reply.code(500).send(e);
  }
};

/**
 *
 * @type RouteOptions
 */
module.exports = {
  method: 'GET',
  url: '/libs/*',
  handler
};
