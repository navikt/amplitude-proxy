const constants = require('../constants');
const formats = [
  //  HEX and DASH 6+ usually is an ID, for example start of (faceb)ook actually contains 5 legal hex chars =)
  {regex: /[a-f0-9\-]{6,}/ig, replace: constants.REDACTED},
  // id format https://www.nav.no/initial/1000Ro2Fi
  {regex: /\d[oiA-Z0-9]{8,}/g, replace: constants.REDACTED},
];
module.exports = (url) => {
  let outputUrl = url;
  if(typeof url === 'string' || url instanceof String){
    formats.forEach(format => {
      outputUrl = outputUrl.replace(format.regex, format.replace);
    });
  }
  return outputUrl;
};

