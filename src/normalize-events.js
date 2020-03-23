const getTrackingOptions = require('./get-tracking-options');
const cleanReffererUrls = require('./clean-referrer-urls');

module.exports = function(inputEvents, ip) {
  const outputEvents = [];
  inputEvents.forEach(event => {
    const cloneEvent = Object.assign({}, event);
    if (!cloneEvent.api_properties) {
      cloneEvent.api_properties = {};
    }
    cloneEvent.api_properties.tracking_options = getTrackingOptions(ip);
    cloneEvent.user_agent = null;
    cloneEvent.os_version = null;
    cloneEvent.user_properties = cleanReffererUrls(cloneEvent.user_properties || {})
    outputEvents.push(cloneEvent);
  });
  return outputEvents;
};
