const createServer = require('fastify');
const logger = require('../src/utils/logger');
const generateKafkaMessages = require("./generate-kafka-message")

const launchPreloader = async () => {

  const fastify = createServer({
    logger: false,
    trustProxy: true,
  });

  await fastify.listen(80);
  logger.info('Preloader started;');
  await generateKafkaMessages();
};

launchPreloader().then(() => {

});
