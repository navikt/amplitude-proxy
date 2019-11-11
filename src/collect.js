const validateEvents = require('./validateEvents');
const forwardEvents = require('./forwardEvents');

module.exports = function(request, reply) {
  const events = JSON.parse(request.body.e);
  const apiKey = request.body.client;
  const errors = validateEvents(events);
  if (errors.length > 0) {
    reply.send(errors);
  } else {
    forwardEvents(events,apiKey).then(function(response) {
      if(response.data.code===200){
        reply.send('success');
      } else {
        reply.send(response.data);
      }
    }).catch(function(error) {
      console.error(error);
      reply.send(error.message);
    });
  }
};
