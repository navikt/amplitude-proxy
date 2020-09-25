const KafkaConsumer = require('./kafkaConsumer')

module.exports = function (ingresses, kafkaMessage) {

  let newIngresses = []

  const data = {
    app: kafkaMessage.object.metadata.name,
    team: kafkaMessage.object.metadata.labels.team,
    namespace: kafkaMessage.object.metadata.namespace,
    version: kafkaMessage.object.spec.image.split(':').pop(),
    context: kafkaMessage.cluster,
  }

  if (kafkaMessage.object.spec.ingresses) {
    kafkaMessage.object.spec.ingresses.forEach(ingressRaw => {
      const ingress = ingressRaw.replace(/\/$/, '');
      newIngresses.push({ ...data, ingress })
    });
  }

  newIngresses.forEach((newIngress) => {
    // check if data is already in the list
    const result = ingresses.filter((ingress) => ingress.ingress == newIngress.ingress)

    // if data is found, replace else add new data
    if (result.length > 0) {
      ingresses.filter((ingress) => ingress.ingress == newIngress.ingress).map((data) => {
        data.app = newIngress.app
        data.team = newIngress.team
        data.namespace = newIngress.namespace
        data.version = newIngress.version
      })
    } else {
      ingresses.push(newIngress)
    }
  })
}