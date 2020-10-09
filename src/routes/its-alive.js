const paths = require('../paths');
const handler = async function(req, reply) {
  if(!isAliveStatus){
    reply.code(500).send(errorKafkaConsumer);
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
