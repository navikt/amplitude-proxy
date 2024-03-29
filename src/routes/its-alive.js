const paths = require('../paths');
const logger = require('../utils/logger');

const isAlive = async function(req, reply, isAliveStatus) {
  if (!isAliveStatus.status) {
    logger.error('IsAlive error: ' + isAliveStatus.message)
    reply.code(500).send(isAliveStatus.message);
  } else {
    reply.send('ok');
  }
};

/**
 *
 * @type RouteOptions
 */
module.exports = function(isAliveStatus) {
  return {
    method: ['GET', 'HEAD'],
    url: paths.ITS_ALIVE,
    handler: function(req, reply) {
      isAlive(req, reply, isAliveStatus);
    },
  };

};
