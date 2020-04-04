/**
 * Sjekker om test-ingress-fila er lagd, hvis ikke lager den bare en dummy-fil.
 */
const fs = require('fs');
const path = require('path');
const genIngressesData = require('./generate-ingresses-data');
const ingressesPath = path.resolve(__dirname, '..', 'ingresses', 'tmp', 'ingresses.json');
if (!fs.existsSync(ingressesPath)) {
  fs.writeFileSync(ingressesPath, JSON.stringify(genIngressesData()));
  console.log('Ingress data created and file written to disk...');
} else {
  console.log('Ingress data exists skipping.');
}
