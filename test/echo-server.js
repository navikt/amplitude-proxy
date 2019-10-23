const fastify = require('fastify')({logger: true});

['GET', 'POST'].forEach(method => {
  fastify.route({
    method,
    url: '/*',
    handler: (request, reply) => {
      reply.send({
        headers: request.headers,
        body: request.body
      });
    },
  });
});

const start = async () => {
  try {
    const port = 8484;
    await fastify.listen(port, '0.0.0.0');
  } catch (err) {
    process.exit(1);
  }
};
start();
