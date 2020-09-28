const addClusterDataTest = require('../filters/add-cluster-data-test');
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
const validateEvents = require('../validate-events');
const validUrl = require('../utils/valid-url');

const apiKeyMap = getProjectKeys();

module.exports = function(request, reply, ingresses) {
  const events = JSON.parse(request.body.e);
  const apiKey = request.body.client;
  const errors = validateEvents(events);
  events.forEach(event => {
    if (!validUrl(event.platform)) {
      errors.push('For auto-collect må \'platform\' være satt til window.location');
    }
  });
  const eventsWithClusterData = addClusterDataTest(events, getIngressData);
  const eventHostname = eventsWithClusterData[0].event_properties.hostname;
  const appContext = eventsWithClusterData[0].event_properties.context;
  const realApiKey = apiKeyMap.has(appContext)
      ? apiKeyMap.get(appContext)
      : apiKeyMap.get('*');
  const log = createRequestLog(realApiKey,events[0].event_type,events[0].device_id,request.headers['user-agent'])
  const autoTrackKey = process.env.AUTO_TRACK_KEY || 'default';
  if (apiKey !== autoTrackKey) {
    reply.code(400).send('Apikey is wrong... need do match the AUTO_TRACK_KEY.');

  } else if (errors.length > 0) {
    reply.code(400).send(errors);

  } else if (isBot(request.headers['user-agent'])) {
    logger.info(log('Request was ignored as bot traffic'));
    reply.send(constants.IGNORED);

  } else if (eventHostname && ignoredHost(eventHostname)) {
    reply.send(constants.SUCCESS);

  } else {
    const eventsWithProxyData = addProxyData(eventsWithClusterData, process.env.NAIS_APP_IMAGE);
    const eventsWithGeoData = addGeoData(eventsWithProxyData, request.ip);
    const eventsWithUrlsCleaned = cleanEventUrls(eventsWithGeoData);

    forwardEvents(eventsWithUrlsCleaned, realApiKey, process.env.AMPLITUDE_URL).then(function(response) {
      // Amplitude servers will return a result object which is explisitt set result code
      if (response.data.code !== 200) {
        reply.send(response.data);
      } else if (request.query.debug) {
        reply.send(response.data);
      } else {
        reply.send(constants.SUCCESS);
      }
    }).catch(function(error) {
      logger.error(log(error.message));
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
