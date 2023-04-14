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
      outputUrl = cleanUrlWithExceptions(outputUrl, format.regex, format.replace)
    });
  }
  return outputUrl;
};


// add unique replacers for exceptions
// regex: regex for string value to find 
// tempValue: temporary value to replaces matched value from regex 
// replacers: regex to find tempValue to be able to replace them later
const exceptions = [
  // replaces a string that matches 'nav123456' with 'nav*', will be restored to original value when using cleanUrlWithExceptions
  {regex: /nav[0-9]{6}/g, tempValue: 'nav*', replacer: /nav\*/g},
  // test replacer to check if method can handle multiple exceptions
  {regex: /test[0-9]{6}/g, tempValue: 'test*', replacer: /test\*/g}
]

// replaces the matched string with a temp value before cleaning url. After url is cleaned restores the temp value to its original state
const cleanUrlWithExceptions = (outputUrl,formatRegex, formatReplacer) => {
  
  // list of found excluded string value with replacers on how to match and replace them to orignal value
  let exceptionMatch = []

  // replaces all exception strings with a temp value, so that id cleanup will not affect excluded strings
  exceptions.forEach(ex => {
    let match = outputUrl.match(ex.regex)

    if(match && match.length > 0) {
      outputUrl = outputUrl.replace(ex.regex, ex.tempValue);
      exceptionMatch.push({originalValue: match, replacer: ex.replacer})
    }
  })

  // url cleanup for ids
  outputUrl = outputUrl.replace(formatRegex, formatReplacer);

  // replaces temp values to its original value
  if(exceptionMatch.length > 0) {
    exceptionMatch.forEach(em => {
      outputUrl = outputUrl.replace(em.replacer, em.originalValue)
    })
  }

  return outputUrl
}