require('dotenv').config()
const fastify = require('fastify')({logger: true});
fastify.register(require('fastify-formbody'));
fastify.addSchema(require('./schemas/collect'));
fastify.get('/', async () => ({hello: 'world'}));
fastify.get('/health/is-alive', async () => ({is: 'alive'}));
fastify.get('/health/is-ready', async () => ({is: 'ready'}));
fastify.route({
  method: 'POST',
  url: '/collect',
  schema: {
    body: 'collect#',
  },
  handler: require('./src/collect'),
});
const start = async () => {
  try {
    const port = process.env.PORT || 4242;
    await fastify.listen(port, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
