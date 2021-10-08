const buildServer = require('../src/server');
const client = require('prom-client');
const setupTestEnvs = require('./setup-test-envs');

module.exports = async (overrides, testName) => {
  setupTestEnvs(overrides);
  client.register.clear();
  return await buildServer(testName);
};
