const paths = require('../paths');
const handler = async function(req, reply) {
  if(isReadyStatus){
    reply.send("ok");
  } else {
    reply.code(500).send(errorKafkaConsumer);
  }
};
/**
 *
 * @type RouteOptions
 */
module.exports = {
  method: 'GET',
  url: paths.ITS_READY,
  handler
};
