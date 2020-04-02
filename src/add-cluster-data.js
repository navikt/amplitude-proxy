const cleanUrl = require('./utils/clean-url');
const addClusterData = (inputEvents, getIngressData) => {
  const outputEvents = [];
  inputEvents.forEach(event => {
    const cloneEvent = {...event};
    cloneEvent.platform = 'Web'; // Correct this back to the original.
    cloneEvent.event_properties = event.event_properties || {};
    const eventUrl = event.platform;
    cloneEvent.event_properties.url = cleanUrl(eventUrl);
    const ingressData = getIngressData(eventUrl);
    if (ingressData) {
      Object.keys(ingressData).forEach(key => {
        cloneEvent.event_properties[key] = ingressData[key];
      });
    } else {

    }
    outputEvents.push(cloneEvent);
  });

  return outputEvents;
};

module.exports = addClusterData;
