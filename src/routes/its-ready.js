const paths = require('../paths');
const handler = async function (req, reply) {
  if( isReadyStatus.status) {
    reply.send('ok');
  } else {
    reply.code(503).send("App is not ready, still collecting ingresses");
  }
};
/**
 *
 * @type RouteOptions
 */
module.exports = {
    method: 'GET',
    url: paths.ITS_READY,
    handler
};
