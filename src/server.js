const createServer = require('fastify');
const path = require('path');
const logger = require('./utils/logger');
const checkEnvVars = require('./utils/check-env-vars');
const paths = require('./paths');
const kafkaConsumer = require('./kafka/kafkaConsumer');
const getIngressExceptionPath = require('./data/ingressException-path');
const ingressException = require(getIngressExceptionPath());
const {ingressLogStream} = require('./utils/ingress-log');
const {createKafkaConsumer} = require('./kafka/createKafkaConsumer');
const {ingressMap} = require('./data/ingress-map');

/**
 *
 * @returns {Promise<*|fastify.FastifyInstance<http2.Http2SecureServer, http2.Http2ServerRequest, http2.Http2ServerResponse>|fastify.FastifyInstance<http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>|fastify.FastifyInstance<https.Server, http.IncomingMessage, http.ServerResponse>|fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>>}
 */
module.exports = async (name) => {

  const isAliveStatus = {status: true, message: 'Error: '};
  const isReadyStatus = {status: false};
  let serverIsClosed = false;
  let consumerIsReady = false;
  ingressException.forEach(data => ingressMap.set(data.ingress, data));

  const fastify = createServer({
    logger: false,
    trustProxy: true,
  });

  if (checkEnvVars(process.env)) logger.info({msg: 'Environment vars is ok.', name, ingresses: ingressMap.size});

  logger.info({msg: 'Connecting to Kafka: Trying to consume topic ' + process.env.INGRESS_TOPIC, name});
  const consumer = createKafkaConsumer();
  fastify.addHook('onClose', async (instance, done) => {
    serverIsClosed = true;
    ingressLogStream.destroy();
    if (consumerIsReady) await consumer.disconnect();
    logger.info({msg: 'Servers is closed!', name, ingresses: ingressMap.size});
    done();
  });

  kafkaConsumer(consumer, ingressMap, isAliveStatus, isReadyStatus).then(async () => {
    consumerIsReady = true;
    logger.info({msg: 'Kafka Consumer is ready!', name, ingresses: ingressMap.size});
    if (serverIsClosed) await consumer.disconnect();
  });
  fastify.addSchema(require('./schemas/collect'));
  fastify.addSchema(require('./schemas/ingress'));

  fastify.register(require('fastify-cors'), {origin: '*'});
  fastify.register(require('fastify-formbody'));
  fastify.register(require('fastify-metrics'), {endpoint: paths.METRICS});
  fastify.register(require('fastify-static'), {root: path.join(__dirname, '..', 'public')});

  /**
   * Adding routes
   */
  fastify.route(require('./routes/collect'));
  fastify.route(require('./routes/index'));
  fastify.route(require('./routes/libs'));
  fastify.route(require('./routes/your-ip'));
  fastify.route(require('./routes/its-alive')(isAliveStatus));
  fastify.route(require('./routes/its-ready')(isReadyStatus));
  fastify.route(require('./routes/collect-auto')(ingressMap));

  fastify.get(paths.SCHEMAS, (request, reply) => { reply.send(fastify.getSchemas()); });
  return fastify;
};
