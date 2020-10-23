const getIngressData = require('../data/lookup-function')
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
      const ingress = ingressRaw.replace(/\/$/, '');
      newIngresses.push({ ...data, ingress })
    });
  }

  newIngresses.forEach((newIngress) => {
    const ingressData = getIngressData(newIngress.ingress, ingresses);
    if(ingressData) {
      if(ingressData.creationTimestamp < newIngress.creationTimestamp){
        ingresses.set(newIngress.ingress, newIngress)
      }
    } else {
      ingresses.set(newIngress.ingress, newIngress)
    }
  })
  if(ingresses.size > 2000) {
    isReadyStatus.status = true
  }
}