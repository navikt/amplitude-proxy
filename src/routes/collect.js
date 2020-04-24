const addGeoData = require('../filters/add-geo-data');
const addProxyData = require('../filters/add-proxy-data');
const cleanEventUrls = require('../filters/clean-event-urls');
const constants = require('../constants');
const forwardEvents = require('../forward-events');
const ignoredHost = require('../utils/ignored-host');
const isBot = require('isbot');
const logger = require('../utils/logger');
const paths = require('../paths');
const promClient = require('prom-client');
const validateEvents = require('../validate-events');

const collectCounter = new promClient.Counter({
  name: 'collect_endpoint',
  help: 'Count of requests received',
  labelNames: ['message', 'projectKey'],
});
const handler = function(request, reply) {
  const inputEvents = JSON.parse(request.body.e);
  const apiKey = request.body.client;
  const shortApiKey = request.body.client.substring(0, 6)
  const errors = validateEvents(inputEvents);
  if (errors.length > 0) {
    collectCounter.labels('events_had_errors', shortApiKey).inc();
    reply.code(400).send(errors);
  } else if (isBot(request.headers['user-agent'])) {
    collectCounter.labels('ignored_as_bot_traffic', shortApiKey).inc();
    logger.info({
      msg: 'Request was ignored as bot traffic',
      project_key: apiKey,
      event_type: inputEvents[0].event_type,
      device_id: inputEvents[0].device_id,
      user_agent: request.headers['user-agent'],
    });
    reply.send(constants.IGNORED);
  } else {
    const eventsWithProxyData = addProxyData(inputEvents, process.env.NAIS_APP_IMAGE);
    const eventsWithGeoData = addGeoData(eventsWithProxyData, request.ip);
    const eventsWithUrlsCleaned = cleanEventUrls(eventsWithGeoData);
    forwardEvents(eventsWithUrlsCleaned, apiKey, process.env.AMPLITUDE_URL).then(function(response) {
      // Amplitude servers will return a result object which is explisitt set result code
      if (response.data.code !== 200 || request.query.debug) {
        collectCounter.labels('failed_ingesting_events', shortApiKey).inc();
        reply.send(response.data);
      } else {
        collectCounter.labels('success',shortApiKey).inc();
        reply.send(constants.SUCCESS);
      }
    }).catch(function(error) {
      logger.error({
        msg: error.message,
        project_key: apiKey,
        event_type: inputEvents[0].event_type,
        device_id: inputEvents[0].device_id,
        user_agent: request.headers['user-agent'],
      });
      collectCounter.labels('failed_proxy_events', shortApiKey).inc();
      reply.code(502).send({
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
