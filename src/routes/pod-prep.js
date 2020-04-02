const fetchIngresses = require('../fetch-ingresses');
module.exports = async function(req, reply) {
  const result = await fetchIngresses();
  if(result){
    reply.send('ok');
  } else {
    reply.code(503).send('ok');
  }
};
