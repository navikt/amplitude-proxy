const handler = function(req, reply) {
  reply.sendFile('index.html');
};
/**
 *
 * @type RouteOptions
 */
module.exports = {
  method: 'GET',
  url: '/',
  handler
};
