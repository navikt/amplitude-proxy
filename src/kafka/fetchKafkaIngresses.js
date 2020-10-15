const getIngressData = require('../data/lookup-function')
const logger = require('../utils/logger');

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
    if(ingressData) {
      logger.info("                ")
      logger.info(ingressData.creationTimestamp)
      logger.info(newIngress.creationTimestamp)
      logger.info("                ")
      if(ingressData.creationTimestamp < newIngress.creationTimestamp){
        logger.info("                ")
        logger.info("UPDATED")
        logger.info("                ")
        ingresses.set(newIngress.ingress, newIngress)
      } else {
        logger.info("                ")
        logger.info("IGNORED")
        logger.info("                ")
      }
    } else {
      ingresses.set(newIngress.ingress, newIngress)
    }
  })
}