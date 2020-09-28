const addClusterDataTest = (inputEvents, ingressData) => {
  const outputEvents = [];
  inputEvents.forEach(event => {
    const cloneEvent = {...event};
    cloneEvent.platform = 'Web'; // Correct this back to the original.
    cloneEvent.event_properties = event.event_properties || {};
    const eventUrl = event.platform;
    if (ingressData) {
      Object.keys(ingressData).forEach(key => {
        cloneEvent.event_properties[key] = ingressData[key];
      });
    }
    const eventUrlObj = new URL(eventUrl);
    cloneEvent.event_properties.url = eventUrlObj.hostname + eventUrlObj.pathname;
    cloneEvent.event_properties.hostname = eventUrlObj.hostname;
    cloneEvent.event_properties.pagePath = eventUrlObj.pathname;
    outputEvents.push(cloneEvent);
  });
  return outputEvents;
};

module.exports = addClusterDataTest;
