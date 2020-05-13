const geoLookup = require('geoip-lite').lookup;
module.exports = async function(request, reply) {
  reply.send({
    ip: request.ip,
    ips: request.ips,
    headers: request.headers,
    hostname: request.hostname,
    geoip: geoLookup(request.ip),
  });
};
