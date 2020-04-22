const fastify = require('fastify')({logger: false});
const ingressData = require('./generate-ingresses-data');
const logger = require('../src/utils/logger');
module.exports = async (port, data) => {
  try {
    const usingData = data || ingressData();
    fastify.get('/ingresses.json', (request, reply)=>{
      reply.send(usingData)
    });
    await fastify.listen(port, '0.0.0.0');
    logger.info("Started, test ingress server with " + usingData.length + " entries on port "+port);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
  return fastify;
};
