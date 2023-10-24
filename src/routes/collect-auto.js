const addClusterData = require('../filters/add-cluster-data');
const addGeoData = require('../filters/add-geo-data');
const addProxyData = require('../filters/add-proxy-data');
const cleanEventUrls = require('../filters/clean-event-urls');
const constants = require('../constants');
const createRequestLog = require('../utils/create-request-log');
const forwardEvents = require('../forward-events');
const getIngressData = require('../data/lookup-function');
const getProjectKeys = require('../data/get-project-keys');
const ignoredHost = require('../utils/ignored-host');
const isBot = require('isbot');
const logger = require('../utils/logger');
const paths = require('../paths');
const promClient = require('prom-client');
const validateEvents = require('../validate-events');
const validUrl = require('../utils/valid-url');

const collectCounter = new promClient.Counter({
  name: 'collect_auto_endpoint',
  help: 'Count of requests received to the auto collect endpoint',
  labelNames: ['message', 'app', 'team'],
});

const apiKeyMap = getProjectKeys();

const customHandler = function (request, reply, ingresses) {
  let events;
  let errors = []
  let apiKey;
  let usingNewSdk = false

  isBot.extend(['CSS Validator:'])

  if (request.body.events && request.body.events !== null) {
    events = request.body.events
    apiKey = request.body.api_key;
    usingNewSdk = true
  } else {
    events = JSON.parse(request.body.e);
    apiKey = request.body.client;
    errors = validateEvents(events);
    usingNewSdk = false
  }

  events.forEach(event => {

    //Sjekker om platform er satt i event_properties og validerer url
    if (event.event_properties.platform && !validUrl(event.event_properties.platform)) {
      errors.push('For auto-collect må window.location settes i \'platform\' eller være satt i \'event_properties\' i \'platform\'');
    } 
    
    //dersom platform er ikke satt i event_properties vil den da hente validere url fra platform eller 
    //ingestion_metadata ut ifra om du bruker den nye sdk-et
    else {
      if (usingNewSdk) {
        if (!event.ingestion_metadata && !event.ingestion_metadata.source_name) {
          errors.push('Når du bruker den nye skd for auto-collect må \'source name\' i \'ingestion metadata\' være satt til window.location');
        } else {
          if (!validUrl(event.ingestion_metadata.source_name)) {
            errors.push('Når du bruker den nye skd for auto-collect må \'source name\' i \'ingestion metadata\' være satt til window.location');
          }
        }
      } else {
        if (!validUrl(event.platform)) {
          errors.push('For auto-collect må window.location settes i \'platform\' eller være satt i \'event_properties\' i \'platform\'');
        }
      }
    }
  });


  const eventsWithClusterData = addClusterData(events, getIngressData, ingresses, usingNewSdk);
  const appName = eventsWithClusterData[0].event_properties.app;
  const teamName = eventsWithClusterData[0].event_properties.team;
  const eventHostname = eventsWithClusterData[0].event_properties.hostname;
  const appContext = eventsWithClusterData[0].event_properties.context;
  const realApiKey = apiKeyMap.has(appContext)
    ? apiKeyMap.get(appContext)
    : apiKeyMap.get('*');
  const log = createRequestLog(realApiKey, events[0].event_type, events[0].device_id, request.headers['user-agent'], request.headers['origin']);

  const autoTrackKey = process.env.AUTO_TRACK_KEY || 'default';
  if (apiKey !== autoTrackKey) {
    collectCounter.labels('wrong_api_key', appName, teamName).inc();
    logger.error(log('Apikey is wrong... need do match the AUTO_TRACK_KEY.'))
    reply.code(400).send('Apikey is wrong... need do match the AUTO_TRACK_KEY.');

  } else if (errors.length > 0) {
    collectCounter.labels('events_had_errors', appName, teamName).inc();
    logger.error(log(errors))
    reply.code(400).send(errors);

  } else if (isBot(request.headers['user-agent'])) {
    collectCounter.labels('ignored_as_bot_traffic', appName, teamName).inc();
    logger.info(log('Request was ignored as bot traffic'));
    reply.send(constants.IGNORED);

  } else if (eventHostname && ignoredHost(eventHostname)) {
    collectCounter.labels('ignored_as_dev_traffic', appName, teamName).inc();
    reply.send(constants.SUCCESS);

  } else {
    const eventsWithProxyData = addProxyData(eventsWithClusterData, process.env.NAIS_APP_IMAGE);
    const eventsWithGeoData = addGeoData(eventsWithProxyData, request.ip, usingNewSdk);
    const eventsWithUrlsCleaned = cleanEventUrls(eventsWithGeoData);

    forwardEvents(eventsWithUrlsCleaned, realApiKey, process.env.AMPLITUDE_URL).then(function (response) {
      // Amplitude servers will return a result object which is explisitt set result code
      if (response.data.code !== 200) {
        collectCounter.labels('failed_ingesting_events', appName, teamName).inc();
        reply.send(response.data);
      } else if (request.query.debug) {
        collectCounter.labels('success_with_debug', appName, teamName).inc();
        reply.send(response.data);
      } else {
        collectCounter.labels('success', appName, teamName).inc();
        if (request.body.events && request.body.events !== null) {
          reply.send(response.data);
        } else {
          reply.send(constants.SUCCESS);
        }
      }
    }).catch(function (error) {
      collectCounter.labels('failed_proxy_events', appName, teamName).inc();
      let errorCode = 502
      if (error.status) {
        errorCode = error.status
      } else if (error.response && error.response.status) {
        errorCode = error.response.status
      }
      logger.error({ ...log(error.message), status_code: errorCode });
      reply.code(errorCode).send({
        statusCode: errorCode,
        message: 'Failed to proxy request',
        error: error.message,
      });
    });
  }
};

module.exports = function (ingresses) {
  return {
    method: 'POST',
    url: paths.COLLECT_AUTO,
    schema: {
      body: { $ref: 'collect#' },
    },
    handler: function (request, reply) {
      customHandler(request, reply, ingresses);
    },
  };
};
