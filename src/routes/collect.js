const addGeoData = require('../filters/add-geo-data');
const addProxyData = require('../filters/add-proxy-data');
const cleanEventUrls = require('../filters/clean-event-urls');
const constants = require('../constants');
const createRequestLog = require('../utils/create-request-log');
const forwardEvents = require('../forward-events');
const ignoredHost = require('../utils/ignored-host');
const {isbot} = require('isbot');
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
  
  let inputEvents;
  let errors = [];
  let apiKey;
  let shortApiKey;
  let usingNewSdk = false
  
  if(request.body.events  && request.body.events !== null) {
    inputEvents = request.body.events 
    apiKey = request.body.api_key
    shortApiKey = request.body.api_key.substring(0, 6)
    usingNewSdk = true
  } else {
   inputEvents = JSON.parse(request.body.e)
    errors = validateEvents(inputEvents);
    apiKey = request.body.client;
    shortApiKey = request.body.client.substring(0, 6)
    usingNewSdk = false
  }
  
  const log = createRequestLog(apiKey,inputEvents[0].event_type,inputEvents[0].device_id,request.headers['user-agent'], request.headers['origin'])
  
  if (errors.length > 0) {
    collectCounter.labels('events_had_errors', shortApiKey).inc();
    logger.error(log(errors))
    reply.code(400).send(errors);
  } else if (isbot(request.headers['user-agent'])) {
    collectCounter.labels('ignored_as_bot_traffic', shortApiKey).inc();
    logger.info(log('Request was ignored as bot traffic'));
    reply.send(constants.IGNORED);
  } else {
    const eventsWithProxyData = addProxyData(inputEvents, process.env.NAIS_APP_IMAGE);
    const eventsWithGeoData= addGeoData(eventsWithProxyData, request.ip, usingNewSdk);
    const eventsWithUrlsCleaned = cleanEventUrls(eventsWithGeoData);
    forwardEvents(eventsWithUrlsCleaned, apiKey, process.env.AMPLITUDE_URL).then(function(response) {
      // Amplitude servers will return a result object which is explisitt set result code
      if (response.data.code !== 200 || request.query.debug) {
        collectCounter.labels('failed_ingesting_events', shortApiKey).inc();
        reply.send(response.data);
      } else {
        collectCounter.labels('success',shortApiKey).inc();
        if(request.body.events && request.body.events !== null) {
          reply.send(response.data);
        } else {
          reply.send(constants.SUCCESS);
        }
      }
    }).catch(function(error) {
      let errorCode = 502
      if(error.status) {
        errorCode = error.status
      } else if ( error.response && error.response.status) {
        errorCode = error.response.status
      }
      logger.error({...log(error.message), status_code: errorCode});
      collectCounter.labels('failed_proxy_events', shortApiKey).inc();
      reply.code(errorCode).send({
        statusCode: errorCode,
        message: 'Failed to proxy request',
        error: error.message,
      });
    });
  }
};

/**
 *
 * @type RouteOptions
 */
module.exports = {
  method: 'POST',
  url: paths.COLLECT,
  schema: {
    body: { $ref: 'collect#' },
  },
  handler
};
