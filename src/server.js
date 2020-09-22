const createServer = require('fastify');
const path = require('path');
const logger = require('./utils/logger');
const checkEnvVars = require('./utils/check-env-vars');
const paths = require('./paths');
const fetchIngresses = require('./data/fetch-ingresses');
const KafkaConsumer = require('./kafka/kafkaConsumer');
/**
 *
 * @returns {Promise<*|fastify.FastifyInstance<http2.Http2SecureServer, http2.Http2ServerRequest, http2.Http2ServerResponse>|fastify.FastifyInstance<http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>|fastify.FastifyInstance<https.Server, http.IncomingMessage, http.ServerResponse>|fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>>}
 */
module.exports = async () => {
  const fastify = createServer({
    logger: false,
    trustProxy: true,
  });
  if (checkEnvVars(process.env)) logger.info('Environment vars is ok.');
  KafkaConsumer()
  if (await fetchIngresses(process.env.INGRESSES_URL)) logger.info('Ingresses fetched successfully.');
  fastify.addSchema(require('./schemas/collect'));
  fastify.addSchema(require('./schemas/ingress'));
  fastify.register(require('fastify-cors'), {origin: '*'});
  fastify.register(require('fastify-formbody'));
  fastify.register(require('fastify-metrics'), {endpoint: paths.METRICS});
  fastify.register(require('fastify-static'), {root: path.join(__dirname, '..', 'public')});
  fastify.route(require('./routes/collect'));
  fastify.route(require('./routes/collect-auto'));
  fastify.route(require('./routes/index'));
  fastify.route(require('./routes/ingresses'));
  fastify.route(require('./routes/its-alive'));
  fastify.route(require('./routes/its-ready'));
  fastify.route(require('./routes/libs'));
  fastify.route(require('./routes/your-ip'));
  fastify.get(paths.SCHEMAS, (request, reply) => { reply.send(fastify.getSchemas()) })
  return fastify;
};
