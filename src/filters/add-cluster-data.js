const addClusterData = (inputEvents, getIngressData) => {
  const outputEvents = [];
  inputEvents.forEach(event => {
    const cloneEvent = {...event};
    cloneEvent.platform = 'Web'; // Correct this back to the original.
    cloneEvent.event_properties = event.event_properties || {};
    const eventUrl = event.platform;
    const eventUrlObj = new URL(eventUrl);
    cloneEvent.event_properties.hostname = eventUrlObj.hostname;
    cloneEvent.event_properties.pagePath = eventUrlObj.pathname;
    const ingressData = getIngressData(eventUrl);
    if (ingressData) {
      Object.keys(ingressData).forEach(key => {
        cloneEvent.event_properties[key] = ingressData[key];
      });
    }
    outputEvents.push(cloneEvent);
  });
  return outputEvents;
};

module.exports = addClusterData;
