const validateEvents = require('./validateEvents');
const forwardEvents = require('./forwardEvents');

module.exports = function(request, reply) {
  const events = JSON.parse(request.body.e);
  const errors = validateEvents(events);
  if (errors.length > 0) {
    reply.send(errors);
  } else {
    forwardEvents(events).then(function(response) {
      reply.send(response.data);
    }).catch(function(error) {
      console.error(error);
      reply.send(error.message);
    });
  }
};
