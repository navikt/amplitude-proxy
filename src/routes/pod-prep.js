const fetchIngresses = require('../data/fetch-ingresses');
module.exports = async function(req, reply) {
  const result = await fetchIngresses(process.env.INGRESSES_URL);
  if(result){
    reply.send('ok');
  } else {
    reply.code(503).send('ok');
  }
};
