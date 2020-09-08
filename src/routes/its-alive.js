const paths = require('../paths');
const handler = async function(req, reply) {
  reply.send('ok');
};
/**
 *
 * @type RouteOptions
 */
module.exports = {
  method: 'GET',
  url: paths.ITS_ALIVE,
  handler
};
