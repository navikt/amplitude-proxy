const promClient = require('prom-client');

module.exports = function(req, reply) {
  reply.type(promClient.register.contentType).send(promClient.register.metrics());
};
