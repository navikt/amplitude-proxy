const validateEvents = require('../validate-events');
const normalizeEvents = require('../normalize-events');
const forwardEvents = require('../forward-events');
const isBot = require('isbot');
const paths = require('../paths');
const constants = require('../constants');
const logger = require('../logger');
const promClient = require('prom-client');

const collectCounter = new promClient.Counter({
  name: 'collect_endpoint',
  help: 'Count of requests received',
  labelNames: ['message', 'projectKey'],
});
const handler = function(request, reply) {
  const events = JSON.parse(request.body.e);
  const apiKey = request.body.client;
  const shortApiKey = request.body.client.substring(0, 6)
  const errors = validateEvents(events);
  if (errors.length > 0) {
    collectCounter.labels('events_had_errors', shortApiKey).inc();
    reply.send(errors);
  } else if (isBot(request.headers['user-agent'])) {
    collectCounter.labels('ignored_as_bot_traffic', shortApiKey).inc();
    logger.info({
      msg: 'Request was ignored as bot traffic',
      project_key: apiKey,
      event_type: events[0].event_type,
      device_id: events[0].device_id,
      user_agent: request.headers['user-agent'],
    });
    reply.send(constants.IGNORED);
  } else {
    const normalizedEvents = normalizeEvents(events, request.ip);
    forwardEvents(normalizedEvents, apiKey, process.env.AMPLITUDE_URL).then(function(response) {
      // Amplitude servers will return a result object which is explisitt set result code
      if (response.data.code !== 200 || request.query.debug) {
        reply.send(response.data);
      } else {
        collectCounter.labels('success',shortApiKey).inc();
        reply.send(constants.SUCCESS);
      }
      collectCounter.labels(response.data.code === 200
          ? 'success' : 'failed_ingesting_events', shortApiKey).inc();
    }).catch(function(error) {
      logger.error({
        msg: error.message,
        project_key: apiKey,
        event_type: events[0].event_type,
        device_id: events[0].device_id,
        user_agent: request.headers['user-agent'],
      });
      collectCounter.labels('failed_proxy_events', shortApiKey).inc();
      reply.send({
        statusCode: 502,
        message: 'Failed to proxy request',
        error: error.message,
      });
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
