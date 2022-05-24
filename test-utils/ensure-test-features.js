/**
 * Sjekker om test-fila ligger der. Hvis ikke lager den en ny bastert på test-key i pipeline.
 */
const fs = require('fs');
const path = require('path');
const setupTestEnvs = require('./setup-test-envs');
const logger = require('../src/utils/logger');

const secretsPath = path.resolve(__dirname, '..', 'secrets', 'project-keys.json');

/**
 * Setting up test project keys
 */
if (!fs.existsSync(secretsPath)) {
  if (!process.env.TEST_PROJECT_KEY) {
    logger.info('Need to set TEST_PROJECT_KEY in environment to create a project-keys file.');
    process.exit(1);
  }

  const test = [process.env.TEST_PROJECT_KEY]
  fs.writeFileSync(secretsPath, JSON.stringify({
    [process.env.TEST_PROJECT_KEY]: '*',
  }));
  logger.info('Created a new project keys file.');
  logger.info(JSON.stringify({
    test: '*',
  }))
} else {
  logger.info('Project keys file already exists.');
}
