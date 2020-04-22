const geoLookup = require('geoip-lite').lookup;

module.exports = function(ip) {
  const geo = geoLookup(ip);
  const trackingOptions = {
    ip_address: false,
    version_name: false,
    dma: false,
  };
  if (geo && geo.city) {
    trackingOptions.city = geo.city;
  }
  if (geo && geo.region) {
    trackingOptions.region = geo.region;
  }
  if (geo && geo.country) {
    trackingOptions.country = geo.country;
  }
  return trackingOptions;
};
