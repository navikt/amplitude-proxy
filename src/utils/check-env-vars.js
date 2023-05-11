const validUrl = require('./valid-url');
const transposeKeyString = require('./transpose-key-string');
const getProjectKeysPath = require('../data/get-project-keys-path');
const fs = require('fs');
const logger = require('./logger');

const checkEnvVars = (envVars) => {

  if (typeof envVars !== 'object') {
    throw Error('Env vars need to be an object');
  }

  if (!validUrl(envVars['AMPLITUDE_URL'])) {
    throw Error('AMPLITUDE_URL is not configured correct.');
  }

  if (!envVars['PROJECT_KEYS_FILE'] && !envVars['PROJECT_KEYS']) {
    throw Error('PROJECT_KEYS_FILE or PROJECT_KEYS is not set.');
  }

  logger.info("# ENV - PROJECT_KEYS: " + envVars['PROJECT_KEYS']);
  logger.info("# ENV - PROJECT_KEYS_FILE: " + envVars['PROJECT_KEYS_FILE']);
  logger.info("# ENV - AMPLITUDE_URL: " + envVars['AMPLITUDE_URL']);

  let projectKeysString;

  if (envVars['PROJECT_KEYS_FILE']) {
    const projectKeysFileName = getProjectKeysPath();
    const projectKeysFileDesc = 'PROJECT_KEYS_FILE (' + projectKeysFileName + ')';
    if (!fs.existsSync(projectKeysFileName)) {
      throw Error(projectKeysFileDesc + ' doesn\'t exist.');
    }
    projectKeysString = fs.readFileSync(projectKeysFileName, 'utf-8');
  } else {
    projectKeysString = envVars['PROJECT_KEYS'];
  }

  try {
    JSON.parse(projectKeysString);
  } catch (e) {
    logger.error(e);
    throw Error('Cannot parse project key string.');
  }
  if (!transposeKeyString(projectKeysString).has('*')) {
    throw Error('Project key string have no default project.');
  }
  return true;
};

module.exports = checkEnvVars;
