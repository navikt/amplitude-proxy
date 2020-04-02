const logger = require('../utils/logger');
module.exports = function(req, reply) {
  logger.info({
    msg: 'Request with user agent: ' + req.user_agent + ' was blocked.',
  });
  reply.send({
    verify: 'Verified',
  });
};
