const constants = require('../constants');
const addProxyData = (inputEvents, dockerImagePath) => {
  let proxyVersion = constants.UNKNOWN;
  if (typeof dockerImagePath == 'string') {
    proxyVersion = dockerImagePath.split(':').pop();
  }
  const outputEvents = [];
  inputEvents.forEach(event => {
    const cloneEvent = {...event};
    cloneEvent.event_properties = event.event_properties || {};
    cloneEvent.event_properties.proxyVersion = proxyVersion || constants.UNKNOWN;
    outputEvents.push(cloneEvent);
  });

  return outputEvents;
};

module.exports = addProxyData;
