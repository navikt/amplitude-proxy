const geoLookup = require('geoip-lite').lookup;
module.exports = function(inputEvents, ip) {
  const outputEvents = [];
  if(ip){
    const geoData = geoLookup(ip);
    inputEvents.forEach(event => {
      const cloneEvent = Object.assign({}, event);
      cloneEvent.user_agent = null;
      cloneEvent.os_version = null;
      if (geoData && geoData.country) cloneEvent.country = geoData.country;
      if (geoData && geoData.region) cloneEvent.region = geoData.region;
      if (geoData && geoData.city) cloneEvent.city = geoData.city;
      if (geoData && geoData.ll) cloneEvent.location_lat = geoData.ll[0];
      if (geoData && geoData.ll) cloneEvent.location_lng = geoData.ll[1];
      outputEvents.push(cloneEvent);
    });
  } else {
    inputEvents.forEach(event => {
      const cloneEvent = Object.assign({}, event);
      cloneEvent.user_agent = null;
      cloneEvent.os_version = null;
      cloneEvent.country = null;
      cloneEvent.region = null;
      cloneEvent.city = null;
      cloneEvent.location_lat = null;
      cloneEvent.location_lng = null;
      outputEvents.push(cloneEvent);
    });
  }
 
  return outputEvents;
};
