const getIngressData = require('../data/lookup-function')
const logger = require('../utils/logger');
const fs = require('fs')
const path = require('path')

module.exports = function (ingresses, kafkaMessage) {

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
    logger.info("           ")
    if(ingressData) {
      logger.info(ingressData.creationTimestamp)
      logger.info(newIngress.creationTimestamp)
      if(Date.parse(ingressData.creationTimestamp) < Date.parse(newIngress.creationTimestamp)){
        ingresses.delete(newIngress.ingress)
        ingresses.set(newIngress.ingress, newIngress)
        logger.info("UPDATED " + ingressData.app + " to " + newIngress.app)
        logger.info("UPDATED " + ingressData.namespace + " to " + newIngress.namespace)
        logger.info("UPDATED " + ingressData.context + " to " + newIngress.context)
      } else {
        logger.info("IGNORED " + newIngress.app + " to " +  ingressData.app )
        logger.info("IGNORED " + newIngress.namespace + " to " + ingressData.namespace )
        logger.info("IGNORED " + newIngress.context + " to " + ingressData.context )
      }
    } else {
      ingresses.set(newIngress.ingress, newIngress)
    }
    logger.info("           ")
  })
}