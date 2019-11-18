const validateEvents = require('../validate-events');
const normalizeEvents = require('../normalize-events');
const forwardEvents = require('../forward-events');
const paths = require('../paths');
const handler = function(request, reply) {
  const events = JSON.parse(request.body.e);
  const apiKey = request.body.client;
  const errors = validateEvents(events);
  if (errors.length > 0) {
    reply.send(errors);
  } else {
    const normalizedEvents = normalizeEvents(events, request.ip);
    forwardEvents(normalizedEvents, apiKey, process.env.AMPLITUDE_URL).then(function(response) {
      // Amplitude servers will return a result object which is explisitt set result code
      if (response.data.code !== 200 || request.query.debug) {
        reply.send(response.data);
      } else {
        reply.send('success');
      }
    }).catch(function(error) {
      reply.send(error.message);
    });
  }
};
module.exports = {
  method: 'POST',
  url: paths.COLLECT,
  schema: {
    body: 'collect#',
  },
  handler,
};
