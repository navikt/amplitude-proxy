const fs = require('fs');
const path = require('path');

const parseContext = (context, contextData) => {
  const allData = [];
  contextData.items.forEach(item => {
    const data = {
      app: item.metadata.name,
      team: item.metadata.labels.team,
      namespace: item.metadata.namespace,
      version: item.spec.image.split(':').pop(),
      context: context,
    };
    if (item.spec.ingresses) {
      item.spec.ingresses.forEach(ingressRaw => {
        const ingress = ingressRaw.replace(/\/$/, '');
        allData.push({...data, ingress});
      });
    }
  });
  return allData;
};
const parentDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(__dirname, '../..');
const contexts = 'dev-sbs dev-fss prod-sbs prod-fss dev-gcp prod-gcp labs-gcp'.split(' ');
let data = require(parentDir + '/data/unntak.json');
data.forEach(entry => {
  ['app', 'team', 'namespace', 'version', 'context'].forEach(key => {
    if (!entry[key]) {
      throw Error('Can\'t create ingresses. Unexpected format');
    }
  });
});
contexts.forEach(context => {
  const contextData = require(parentDir + '/tmp/' + context);
  data = data.concat(parseContext(context, contextData));
});

fs.writeFileSync(rootDir + '/cache/ingresses.json', JSON.stringify(data), 'utf-8');
fs.writeFileSync(parentDir + '/tmp/ingresses.json', JSON.stringify(data), 'utf-8');
