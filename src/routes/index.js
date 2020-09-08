const handler = function(req, reply) {
  reply.sendFile('index.txt');
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
