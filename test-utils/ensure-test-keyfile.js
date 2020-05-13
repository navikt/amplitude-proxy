/**
 * Sjekker om test-fila ligger der. Hvis ikke lager den en ny bastert på test-key i pipeline.
 */
const fs = require('fs');
const path = require('path');
const secretsPath = path.resolve(__dirname, '..', 'secrets', 'project-keys.json');
if (!fs.existsSync(secretsPath)) {
  if(!process.env.TEST_PROJECT_KEY){
    console.log('Need to set TEST_PROJECT_KEY in environment to create a project-keys file.');
    process.exit(1);
  }
  fs.writeFileSync(secretsPath, JSON.stringify({
    [process.env.TEST_PROJECT_KEY]: '*',
  }));
  console.log('Created a new project keys file.');
} else {
  console.log('Project keys file already exists.');
}
