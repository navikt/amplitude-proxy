const {ingressLog} = require('../utils/ingress-log');

module.exports = function(ingresses, kafkaMessage, isReadyStatus, ignoreAppList) {

  let newIngresses = [];

  const data = {
    app: kafkaMessage.object.metadata.name,
    team: kafkaMessage.object.metadata.labels.team ? kafkaMessage.object.metadata.labels.team : '',
    namespace: kafkaMessage.object.metadata.namespace,
    version: kafkaMessage.object.spec.image.split(':').pop(),
    context: kafkaMessage.cluster,
    creationTimestamp: kafkaMessage.object.metadata.creationTimestamp,
  };

  if (kafkaMessage.object.spec.ingresses) {
    kafkaMessage.object.spec.ingresses.forEach(ingressRaw => {
      const ingress = ingressRaw.replace(/\/$/, '').replace(/\#$/, '');
      newIngresses.push({...data, ingress});
    });
  } else {
    const logStatusNoIngress = ingressLog(
      data.app,
      data.context,
      'no ingress',
      data.creationTimestamp
    )
    logStatusNoIngress('Ignored because no ingresses found')
  }

  newIngresses.forEach((newIngress) => {
    const ingressData = ingresses.get(newIngress.ingress);
    const ignoredApp = ignoreAppList.get(newIngress.ingress);
    const logStatus = ingressLog(
        newIngress.app,
        newIngress.context,
        newIngress.ingress,
        newIngress.creationTimestamp,
    );
    if (ignoredApp && ignoredApp.cluster === newIngress.context && ignoredApp.app === newIngress.app) {
      logStatus('Ignored because of ignoreAppList');
    } else {
      if (ingressData) {
        if (ingressData.creationTimestamp < newIngress.creationTimestamp) {
          ingresses.set(newIngress.ingress, newIngress);
          logStatus('Added to ingress list');

        } else {
          logStatus('Ignored because of creationTimestamp');
        }
      } else {
        logStatus('No duplicate found adding new app');
        ingresses.set(newIngress.ingress, newIngress);
      }
    }
  });

  if (ingresses.size > 4000) {
    isReadyStatus.status = true;
  }
};
