const paths = require('../paths');
const isReady = async function (req, reply, isReadyStatus) {
  if (isReadyStatus.status) {
    reply.send('ok');
  } else {
    reply.code(503).send("App is not ready, still collecting ingresses");
  }
};
/**
 *
 * @type RouteOptions
 */
module.exports = function (isReadyStatus) {
  return {
    method: 'GET',
    url: paths.ITS_READY,
    handler: function (req, reply) {
      isReady(req, reply, isReadyStatus)
    }
  }
};
