const validateEvents = require('../validate-events');
const validUrl = require('../utils/valid-url');
const normalizeEvents = require('../normalize-events');
const getIngressData = require('../get-ingress-data');
const addClusterData = require('../add-cluster-data');
const forwardEvents = require('../forward-events');
const isBot = require('isbot');
const paths = require('../paths');
const constants = require('../constants');
const logger = require('../utils/logger');
const promClient = require('prom-client');
const ignoredHost = require('../utils/ignored-host');
const transposeKeyString = require('../utils/transpose-key-string');
const collectCounter = new promClient.Counter({
  name: 'collect_auto_endpoint',
  help: 'Count of requests received to the auto collect endpoint',
  labelNames: ['message', 'app', 'team'],
});
const apiKeyMap = transposeKeyString(process.env.PROJECT_KEY_MAPPINGS);
const handler = function(request, reply) {
  const events = JSON.parse(request.body.e);
  const apiKey = request.body.client;
  const errors = validateEvents(events);
  events.forEach(event => {
    if (!validUrl(event.platform)) {
      errors.push('For auto-collect må \'platform\' være satt til window.location');
    }
  });
  const eventsWithClusterData = addClusterData(events, getIngressData);
  const appName = eventsWithClusterData[0].event_properties.app;
  const teamName = eventsWithClusterData[0].event_properties.team;
  const eventUrl = eventsWithClusterData[0].event_properties.url;
  const appContext = eventsWithClusterData[0].event_properties.context;
  const realApiKey = apiKeyMap.has(appContext)
      ? apiKeyMap.get(appContext)
      : apiKeyMap.get('*');
  if (apiKey !== process.env.AUTO_TRACK_KEY) {
    collectCounter.labels('wrong_api_key', appName, teamName).inc();
    reply.code(400).send('Apikey is wrong... need do match the AUTO_TRACK_KEY.');

  } else if (errors.length > 0) {
    collectCounter.labels('events_had_errors', appName, teamName).inc();
    reply.code(400).send(errors);

  } else if (isBot(request.headers['user-agent'])) {
    collectCounter.labels('ignored_as_bot_traffic', appName, teamName).inc();
    logger.info({
      msg: 'Request was ignored as bot traffic',
      project_key: realApiKey,
      event_type: events[0].event_type,
      device_id: events[0].device_id,
      user_agent: request.headers['user-agent'],
    });
    reply.send(constants.IGNORED);

  } else if (eventUrl && ignoredHost(eventUrl)) {
    collectCounter.labels('ignored_as_dev_traffic', appName, teamName).inc();
    reply.send('success, but request ignored as test-traffic so its not forwarded.');

  } else {
    const normalizedEvents = normalizeEvents(eventsWithClusterData, request.ip);


    forwardEvents(normalizedEvents, realApiKey, process.env.AMPLITUDE_URL).then(function(response) {
      // Amplitude servers will return a result object which is explisitt set result code
      if (response.data.code !== 200) {
        collectCounter.labels('failed_ingesting_events', appName, teamName).inc();
        reply.send(response.data);
      } else if (request.query.debug) {
        collectCounter.labels('success_with_debug', appName, teamName).inc();
        reply.send(response.data);
      } else {
        collectCounter.labels('success', appName, teamName).inc();
        reply.send(constants.SUCCESS);
      }
    }).catch(function(error) {
      collectCounter.labels('failed_proxy_events', appName, teamName).inc();
      logger.error({
        msg: error.message,
        project_key: realApiKey,
        event_type: events[0].event_type,
        device_id: events[0].device_id,
        user_agent: request.headers['user-agent'],
      });
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
  url: paths.COLLECT_AUTO,
  schema: {
    body: 'collect#',
  },
  handler,
};
