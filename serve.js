// Require the framework and instantiate it
const fastify = require('fastify')({logger: true});
const Ajv = require('ajv');
const ajv = new Ajv();
fastify.register(require('fastify-formbody'));
const validate = ajv.compile(require('./schemas/event'));
// Declare a route
fastify.get('/', async (request, reply) => {
  return {hello: 'world'};
});
fastify.get('/health/is-alive', async (request, reply) => {
  return {is: 'alive'};
});
fastify.get('/health/is-ready', async (request, reply) => {
  return {is: 'ready'};
});
fastify.addSchema({
  $id: 'collect',
  type: 'object',
  properties: {
    e: {'type': 'string'},
    checksum: {'type': 'string'},
    client: {'type': 'string'},
    upload_time: {'type': 'integer'},
    v: {'type': 'integer'},
  },
});

fastify.route({
  method: 'POST',
  url: '/collect',
  schema: {
    body: 'collect#',
  },
  handler: (request, reply) => {
    const jsonContent = JSON.parse(request.body.e);
    const errors = [];
    jsonContent.forEach(event => {
      const result = validate(event);
      if (!result) errors.push(validate.errors);
    });
    if (errors.length > 0) {
      reply.send(errors);
    } else {
      reply.send('ok');
    }
  },
});

// Run the server!
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
