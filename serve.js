const logger = require('./src/utils/logger');
const server = require('./src/server');

const serve = async (port) => {
  const fastify = await server();
  logger.info(`Server is starting...`);
  await fastify.listen(port, '0.0.0.0');
  logger.info(`Server listening on ${port}`);
}

serve(process.env.PORT || 4242).then()
