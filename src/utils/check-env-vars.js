const validUrl = require('./valid-url');
const transposeKeyString = require('./transpose-key-string');
const getProjectKeysPath = require('../data/get-project-keys-path');
const fs = require('fs');

const checkEnvVars = (envVars) => {
  if (typeof envVars !== 'object') {
    throw Error('Env vars need to be an object');
  }
  if (!validUrl(envVars['AMPLITUDE_URL'])) {
    throw Error('AMPLITUDE_URL is not configured correct.');
  }
  if (!validUrl(envVars['INGRESSES_URL'])) {
    throw Error('INGRESSES_URL is not configured correct.');
  }
  if (!envVars['PROJECT_KEYS_FILE']) {
    throw Error('PROJECT_KEYS_FILE is not set.');
  }
  const projectKeysFileName = getProjectKeysPath()
  const projectKeysFileDesc = 'PROJECT_KEYS_FILE (' + projectKeysFileName + ')';
  if (!fs.existsSync(projectKeysFileName)) {
    throw Error(projectKeysFileDesc + ' doesn\'t exist.');
  }
  const projectKeysString = fs.readFileSync(projectKeysFileName, 'utf-8');
  try {
    JSON.parse(projectKeysString);
  } catch (e) {
    throw Error('Cannot parse ' + projectKeysFileDesc + '.');
  }
  if (!transposeKeyString(projectKeysString).has('*')) {
    throw Error(projectKeysFileDesc + ' have no default project.');
  }
  return true;
};

module.exports = checkEnvVars;
