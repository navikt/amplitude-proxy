const nodemonConfig = require('../nodemon');
const {TEST_NODE_ENV, TEST_PROJECT_KEY} = require('./constants');
const setupTestEnvs = (overrides) => {
  Object.keys(nodemonConfig.env).forEach(key => {
    process.env[key] = nodemonConfig.env[key];
  });
  process.env.NODE_ENV = TEST_NODE_ENV;
  process.env.PROJECT_KEYS = JSON.stringify({[TEST_PROJECT_KEY]: '*'});
  if (overrides) {
    Object.keys(overrides).forEach(key => {
      process.env[key] = overrides[key];
    });
  }
};

module.exports = setupTestEnvs
