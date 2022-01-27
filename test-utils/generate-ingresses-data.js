const uuid = require('uuid');
const firstName = require('@faker-js/faker').faker.name.firstName;

/***
 * Keeping this around. One might want to manually populate the ingress map object.
 *
 * @return {*[]}
 */
module.exports = () => {
  const ingresses = [];
  for (let i = 0; i < 4345; i++) {
    const appName = firstName().toLowerCase();
    ingresses.push({
      'app': appName,
      'team': 'team-' + ['batty', 'bitty', 'boff'].sort(() => .5 - Math.random()).pop(),
      'namespace': ['prod', 'dev', 'test'].sort(() => .5 - Math.random()).pop(),
      'version': uuid.v4(),
      'context': ['labs-gcp', 'gcp-ds'].sort(() => .5 - Math.random()).pop(),
      'ingress': 'https://arbeidsgiver.nav.no/' + appName,
    });
  }
  return ingresses
};
