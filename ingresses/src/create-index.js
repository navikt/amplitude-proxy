const parseContext = (context, contextData) => {
  const allData = [];
  contextData.items.forEach(item => {
    const data = {
      appname: item.metadata.name,
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
const parentDir = require('path').resolve(__dirname, '..');
const contexts = 'dev-sbs dev-fss prod-sbs prod-fss dev-gcp prod-gcp'.split(' ');
let data = require(parentDir + '/data/unntak.json');
contexts.forEach(context => {
  const contextData = require(parentDir + '/tmp/' + context);
  data = data.concat(parseContext(context, contextData));
});
const fs = require('fs');
fs.writeFileSync(parentDir + '/tmp/ingresses.json', JSON.stringify(data));
