const createServer = require('fastify');
const path = require('path');
const logger = require('./utils/logger');
const checkEnvVars = require('./utils/check-env-vars');
const paths = require('./paths');
const kafkaConsumer = require('./kafka/kafkaConsumer');
const getIngressExceptionPath = require('./data/ingressException-path');
const ingressException = require(getIngressExceptionPath());
const { ingressLogStream } = require('./utils/ingress-log');
const { createKafkaConsumer } = require('./kafka/createKafkaConsumer');
const promClient = require('prom-client');

/**
 *
 * @returns {Promise<*|fastify.FastifyInstance<http2.Http2SecureServer, http2.Http2ServerRequest, http2.Http2ServerResponse>|fastify.FastifyInstance<http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>|fastify.FastifyInstance<https.Server, http.IncomingMessage, http.ServerResponse>|fastify.FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>>}
 */
module.exports = async (name) => {
  /**
 * Ingress map should be created pr fastify instance.
 * @type {Map<any, any>}
 */
  const ingressMap = new Map();
  const isAliveStatus = { status: true, message: 'Error: ' };
  const isReadyStatus = { status: false };
  let serverIsClosed = false;
  let consumerIsReady = false;
  ingressException.forEach(data => ingressMap.set(data.ingress, data));

  const fastify = createServer({
    logger: false,
    trustProxy: true,
  });

  fastify.decorate('ingresses', ingressMap);

  if (checkEnvVars(process.env)) logger.info({ msg: 'Environment vars is ok.', name, ingresses: ingressMap.size });

  if (process.env.KAFKA_DISABLED === 'true') {
    logger.info({ msg: 'Kafka integration is disabled' });
    isAliveStatus.status = true;
    isReadyStatus.status = true;
  } else {
    logger.info({ msg: 'Connecting to Kafka: Trying to consume topic ' + process.env.KAFKA_INGRESS_TOPIC, name });
    const consumer = createKafkaConsumer();

    fastify.addHook('onClose', async (instance, done) => {
      serverIsClosed = true;
      ingressLogStream.destroy();
      if (consumerIsReady) await consumer.disconnect();
      logger.info({ msg: 'Servers is closed!', name, ingresses: ingressMap.size });
      done();
    });

    kafkaConsumer(consumer, ingressMap, isAliveStatus, isReadyStatus).then(async () => {
      consumerIsReady = true;
      logger.info({ msg: 'Kafka Consumer is ready!', name, ingresses: ingressMap.size });
      if (serverIsClosed) await consumer.disconnect();
    });
  }

  // We parse text/plain as JSON, as the amplitude SDK does not set the content-type to json when
  // using navigator.sendBeacon() to send events
  fastify.addContentTypeParser(
    "text/plain",
    { parseAs: "string" },
    (req, body, done) => {
      try {
        const json = JSON.parse(body);
        done(null, json);
      } catch (error) {
        err.statusCode = 400;
        done(err, undefined);
      }
    },
  );
  fastify.addSchema(require('./schemas/collect'));
  fastify.addSchema(require('./schemas/ingress'));
  

  fastify.register(require('@fastify/cors'), { origin: '*', maxAge: 7200 });
  fastify.register(require('@fastify/formbody'));
  fastify.register(require('fastify-metrics'), { endpoint: paths.METRICS, promClient: promClient });
  fastify.register(require('@fastify/static'), { root: path.join(__dirname, '..', 'public') });

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
