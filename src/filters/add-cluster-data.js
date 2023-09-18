const cleanUrl = require('../utils/clean-url');
const addClusterData = (inputEvents, getIngressData, ingresses) => {
  const outputEvents = [];
  inputEvents.forEach(event => {
    const cloneEvent = { ...event };
    cloneEvent.platform = 'Web'; // Correct this back to the original.
    cloneEvent.event_properties = event.event_properties || {};

    // Prefer the platform field from event properties, for correct url parsing
    // from single-page apps
    let eventUrl = cloneEvent.event_properties.platform || event.platform;
    if(eventUrl.includes('localhost')) {
      eventUrl = eventUrl.replace(/\:[0-9]+/g,'')
    }
    const ingressData = getIngressData(eventUrl, ingresses);
    if (ingressData) {
      Object.keys(ingressData).forEach(key => {
        if (key !== "creationTimestamp") {
          cloneEvent.event_properties[key] = ingressData[key];
        }
      });
    }
    const cleanedEventUrl = cleanUrl(eventUrl);
    const eventUrlObj = new URL(cleanedEventUrl);
    cloneEvent.event_properties.url = eventUrlObj.hostname + eventUrlObj.pathname;
    cloneEvent.event_properties.hostname = eventUrlObj.hostname;
    cloneEvent.event_properties.pagePath = eventUrlObj.pathname;
    outputEvents.push(cloneEvent);
  });
  return outputEvents;
};

module.exports = addClusterData;
