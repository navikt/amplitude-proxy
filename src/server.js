const fastify = require('fastify')({logger: false});
const path = require('path');
const logger = require('./utils/logger');
const checkEnvVars = require('./utils/check-env-vars');
const paths = require('./paths');
const fetchIngresses = require('./fetch-ingresses');
const promClient = require('prom-client');
module.exports = async (port) => {
  try {
    checkEnvVars(process.env)
    await fetchIngresses();
    fastify.register(require('fastify-formbody'));
    fastify.register(require('fastify-cors'), {origin: '*'});
    fastify.register(require('fastify-static'), {root: path.join(__dirname, '..', 'public')});
    fastify.addSchema(require('./schemas/collect'));
    fastify.get('/', require('./routes/index'));
    fastify.get('/libs/*', require('./routes/libs'));
    fastify.get(paths.ITS_ALIVE, async () => ({is: 'alive'}));
    fastify.get(paths.ITS_READY, require('./routes/pod-prep'));
    fastify.get(paths.METRICS, require('./routes/metrics'));
    fastify.route(require('./routes/collect'));
    fastify.route(require('./routes/collect-auto'));
    await fastify.listen(port, '0.0.0.0');
    promClient.collectDefaultMetrics();
    logger.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
  return fastify;
};
