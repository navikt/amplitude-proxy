const fastify = require('fastify')({logger: false});
const path = require('path');
const paths = require('./paths');
fastify.register(require('fastify-formbody'));
fastify.register(require('fastify-cors'), {origin: '*'});
fastify.register(require('fastify-static'), {root: path.join(__dirname, '..', 'public')});
fastify.addSchema(require('./schemas/collect'));
fastify.get('/', require('./routes/index'));
fastify.get('/libs/*', require('./routes/libs'));
fastify.get(paths.ITS_ALIVE, async () => ({is: 'alive'}));
fastify.get(paths.ITS_READY, async () => ({is: 'ready'}));
fastify.route(require('./routes/collect'));
module.exports = async (port) => {
  try {
    await fastify.listen(port, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  return fastify;
};
