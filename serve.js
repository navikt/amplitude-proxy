const logger = require('./src/utils/logger');
const server = require('./src/server');

const serve = async (port) => {
  const fastify = await server();
  logger.info(`Server is starting...`);
  await fastify.listen(port, '0.0.0.0');
  if(!process.env.NAIS_CLUSTER_NAME){
    logger.info(`Server listening on ${port}, visit http://localhost:${port}/`);
  } else {
    logger.info(`Server listening on ${port}`);
  }

};
try {
  serve(process.env.PORT || 4242).then();
} catch (e) {
  logger.error(e.message);
}

