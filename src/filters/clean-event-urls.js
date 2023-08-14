const cleanObjectUrls = require('../utils/clean-object-urls');
const cleanEventUrls = (inputEvents) => {
  const outputEvents = [];
  inputEvents.forEach(event => {
    const cloneEvent = cleanEventUrls({...event});
    cloneEvent.event_properties = cleanObjectUrls(event.event_properties || {});
    cloneEvent.user_properties = cleanObjectUrls(event.user_properties || {});
    outputEvents.push(cloneEvent);
  });
  return outputEvents;
};

module.exports = cleanEventUrls;
