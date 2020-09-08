const geoLookup = require('geoip-lite').lookup;
const handler =  function(request, reply) {
  reply.send({
    ip: request.ip,
    ips: request.ips,
    headers: request.headers,
    hostname: request.hostname,
    geoip: geoLookup(request.ip),
  });
};
/**
 *
 * @type RouteOptions
 */
module.exports = {
  method: 'GET',
  url: '/your-ip',
  handler
};
