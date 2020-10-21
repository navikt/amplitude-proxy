const paths = require('../paths');
const handler = async function(req, reply) {
  if(!isAliveStatus.status){
    reply.code(500).send(isAliveStatus.message);
  } else {
    reply.send("ok");
  }
};
/**
 *
 * @type RouteOptions
 */
module.exports = {
  method: 'GET',
  url: paths.ITS_ALIVE,
  handler
};
