const formats = [
  //  HEX and DASH 6+ usually is an ID, for example start of (faceb)ook actually contains 5 legal hex chars =)
  { regex: /[a-f0-9\-]{6,}/ig, replace: 'masked-id' },
  // id format https://www.nav.no/initial/1000Ro2Fi
  { regex: /\d[oiA-Z0-9]{8,}/g, replace: 'masked-id' }
]

module.exports = function (user_properties) {

  let initial_referrer = user_properties.initial_referrer || ''
  let referrer = user_properties.referrer || ''

  formats.forEach(format => {
    initial_referrer = initial_referrer.replace(format.regex, format.replace)
    referrer = referrer.replace(format.regex, format.replace)
  })

  return {
    ...user_properties,
    initial_referrer,
    referrer
  }
}