/**
 * Sjekker om test-fila ligger der. Hvis ikke lager den en ny bastert på test-key i pipeline.
 */
const fs = require('fs');
const path = require('path');
const {TEST_NODE_ENV, TEST_PROJECT_KEY} = require('./constants');
const logger = require('../src/utils/logger');

const secretsPath = path.resolve(__dirname, '..', 'secrets', 'project-keys.json');

/**
 * Setting up test project keys
 */
if (!fs.existsSync(secretsPath)) {
  fs.writeFileSync(secretsPath, JSON.stringify({
    [TEST_PROJECT_KEY]: '*',
  }));
  logger.info('Created a new project keys file.');
} else {
  logger.info('Project keys file already exists.');
}
