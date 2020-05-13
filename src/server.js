const createServer = require('fastify');
const path = require('path');
const logger = require('./utils/logger');
const checkEnvVars = require('./utils/check-env-vars');
const paths = require('./paths');
const fetchIngresses = require('./data/fetch-ingresses');
const promClient = require('prom-client');
promClient.collectDefaultMetrics();
/**
 *
 * @returns {Promise<*|fastify.FastifyInstance<http2.Http2SecureServer, http2.Http2ServerRequest, http2.Http2ServerResponse>|fastify.FastifyInstance<http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>|fastify.FastifyInstance<https.Server, http.IncomingMessage, http.ServerResponse>|fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>>}
 */
module.exports = async () => {
  const fastify = createServer({
    logger: false,
    trustProxy: true
  })
  if (checkEnvVars(process.env)) {
    logger.info('Environment vars is ok.');
  }
  if (await fetchIngresses(process.env.INGRESSES_URL)) {
    logger.info('Ingresses fetched successfully.');
  }
  fastify.register(require('fastify-formbody'));
  fastify.register(require('fastify-cors'), {origin: '*'});
  fastify.register(require('fastify-static'), {root: path.join(__dirname, '..', 'public')});
  fastify.addSchema(require('./schemas/collect'));
  fastify.get('/', require('./routes/index'));
  fastify.get('/libs/*', require('./routes/libs'));
  fastify.get(paths.ITS_ALIVE, async () => ({is: 'alive'}));
  fastify.get(paths.ITS_READY, require('./routes/its-ready'));
  fastify.get(paths.METRICS, require('./routes/metrics'));
  fastify.get('/your-ip', require('./routes/your-ip'));
  fastify.route(require('./routes/collect'));
  fastify.route(require('./routes/collect-auto'));
  return fastify;
};
