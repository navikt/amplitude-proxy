const addClusterData = require('../filters/add-cluster-data');
const addGeoData = require('../filters/add-geo-data');
const addProxyData = require('../filters/add-proxy-data');
const cleanEventUrls = require('../filters/clean-event-urls');
const constants = require('../constants');
const forwardEvents = require('../forward-events');
const getIngressData = require('../data/get-ingress-data');
const ignoredHost = require('../utils/ignored-host');
const isBot = require('isbot');
const logger = require('../utils/logger');
const paths = require('../paths');
const promClient = require('prom-client');
const getProjectKeys = require('../data/get-project-keys');
const validateEvents = require('../validate-events');
const validUrl = require('../utils/valid-url');

const collectCounter = new promClient.Counter({
  name: 'collect_auto_endpoint',
  help: 'Count of requests received to the auto collect endpoint',
  labelNames: ['message', 'app', 'team'],
});

const apiKeyMap = getProjectKeys();

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
  const eventHostname = eventsWithClusterData[0].event_properties.hostname;
  const appContext = eventsWithClusterData[0].event_properties.context;
  const realApiKey = apiKeyMap.has(appContext)
      ? apiKeyMap.get(appContext)
      : apiKeyMap.get('*');
  const autoTrackKey = process.env.AUTO_TRACK_KEY || 'default';
  if (apiKey !== autoTrackKey) {
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

  } else if (eventHostname && ignoredHost(eventHostname)) {
    collectCounter.labels('ignored_as_dev_traffic', appName, teamName).inc();
    reply.send(constants.SUCCESS);

  } else {
    const eventsWithProxyData = addProxyData(eventsWithClusterData, process.env.NAIS_APP_IMAGE);
    const eventsWithGeoData = addGeoData(eventsWithProxyData, request.ip);
    const eventsWithUrlsCleaned = cleanEventUrls(eventsWithGeoData);

    forwardEvents(eventsWithUrlsCleaned, realApiKey, process.env.AMPLITUDE_URL).then(function(response) {
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
      reply
      .code(502)
      .send({
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
