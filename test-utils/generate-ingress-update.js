const example = require('../examples/ingress-update');
const uuid = require('uuid');
const firstName = require('@faker-js/faker').name.firstName;
module.exports = () => {
  const testUpdate = JSON.parse(JSON.stringify(example));
  const numberOfIngresses = Math.ceil(Math.random() * 5);
  const appName = firstName().toLowerCase();
  const context = ['labs-gcp', 'gcp-ds'].sort(() => .5 - Math.random()).pop();
  testUpdate.uid = uuid.v4();
  testUpdate.collector =""
  testUpdate.ingresses = [];
  for (let step = 1; step < numberOfIngresses; step++) {
    const randomDomain = ['mydomain.com', 'example.com', 'my.nested.domain.com'].sort(() => .5 - Math.random()).pop();
    const randomPath = [appName, appName + '/another', 'prep/' + appName].sort(() => .5 - Math.random()).pop();
    testUpdate.ingresses.push('http://' + randomDomain + '/' + randomPath);
  }
  testUpdate.ingresses = [...new Set(testUpdate.ingresses)];
  testUpdate.props = {
    'app': appName,
    'team': 'team-' + ['batty', 'bitty', 'boff'].sort(() => .5 - Math.random()).pop(),
    'namespace': ['prod', 'dev', 'test'].sort(() => .5 - Math.random()).pop(),
    'version': uuid.v4(),
    'context': context,
  };
  return testUpdate;
};
