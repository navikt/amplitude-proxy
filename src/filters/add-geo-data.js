const getTrackingOptions = require('../utils/get-tracking-options');

module.exports = function(inputEvents, ip) {
  const outputEvents = [];
  inputEvents.forEach(event => {
    const cloneEvent = Object.assign({}, event);
    cloneEvent.api_properties = event.api_properties || {}
    cloneEvent.api_properties.tracking_options = getTrackingOptions(ip);
    cloneEvent.user_agent = null;
    cloneEvent.os_version = null;
    outputEvents.push(cloneEvent);
  });
  return outputEvents;
};
