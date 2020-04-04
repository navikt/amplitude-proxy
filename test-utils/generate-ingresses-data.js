const uuid = require('uuid');
const firstName = require('faker-es6').default.name.firstName;
module.exports = () => {
  const ingresses = [];
  for (let i = 0; i < 2345; i++) {
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
