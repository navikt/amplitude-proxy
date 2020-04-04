const validUrl = require('./valid-url');
const transposeKeyString = require('./transpose-key-string');
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
  if (!envVars['PROJECT_KEY_MAPPINGS'] || !transposeKeyString(envVars['PROJECT_KEY_MAPPINGS']).has("*")) {
    throw Error('PROJECT_KEY_MAPPINGS is not configured correct.');
  }
  return true
};

module.exports = checkEnvVars;
