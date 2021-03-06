const logger = require('../utils/logger');
const fs = require('fs')
const path = require('path')

module.exports = function (ingresses, kafkaMessage, isReadyStatus) {

  let newIngresses = []

  const data = {
    app: kafkaMessage.object.metadata.name,
    team: kafkaMessage.object.metadata.labels.team,
    namespace: kafkaMessage.object.metadata.namespace,
    version: kafkaMessage.object.spec.image.split(':').pop(),
    context: kafkaMessage.cluster,
    creationTimestamp: kafkaMessage.object.metadata.creationTimestamp
  }

  if (kafkaMessage.object.spec.ingresses) {
    kafkaMessage.object.spec.ingresses.forEach(ingressRaw => {
      const ingress = ingressRaw.replace(/\/$/, '').replace(/\#$/, '');
      newIngresses.push({ ...data, ingress })
    });
  }

  newIngresses.forEach((newIngress) => {
    const ingressData = ingresses.get(newIngress.ingress);
    if(ingressData) {
      if(ingressData.creationTimestamp < newIngress.creationTimestamp){
        ingresses.set(newIngress.ingress, newIngress)
        logger.info('Overwritting App: ' + newIngress.app + ' added to ingress list, with ingress: ' + newIngress.ingress)
      }
    } else {
      logger.info('No duplicate found adding new app: ' + newIngress.app + ' added to ingress list, with ingress: ' + newIngress.ingress)
      ingresses.set(newIngress.ingress, newIngress)
    }
  })
  
  if(ingresses.size > 4000) {
    isReadyStatus.status = true
  }
}