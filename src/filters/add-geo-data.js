const geoLookup = require('geoip-lite').lookup;
module.exports = function(inputEvents, ip, usingNewSdk) {
  const outputEvents = [];
    const geoData = geoLookup(ip);
    inputEvents.forEach(event => {
      const cloneEvent = Object.assign({}, event);
      cloneEvent.user_agent = null;
      cloneEvent.os_version = null;
      
      if( usingNewSdk && !event.ip) {
        cloneEvent.country = null;
        cloneEvent.region = null;
        cloneEvent.city = null;
        cloneEvent.location_lat = null;
        cloneEvent.location_lng = null;
      } else if(!usingNewSdk && event.api_properties && event.api_properties.tracking_options && event.api_properties.tracking_options.ip_address === false) {
        cloneEvent.country = null;
        cloneEvent.region = null;
        cloneEvent.city = null;
        cloneEvent.location_lat = null;
        cloneEvent.location_lng = null;
      } else {
        if (geoData && geoData.country) cloneEvent.country = geoData.country;
        if (geoData && geoData.region) cloneEvent.region = geoData.region;
        if (geoData && geoData.city) cloneEvent.city = geoData.city;
        if (geoData && geoData.ll) cloneEvent.location_lat = geoData.ll[0];
        if (geoData && geoData.ll) cloneEvent.location_lng = geoData.ll[1];
      }
      outputEvents.push(cloneEvent);
    });
 
  return outputEvents;
};
