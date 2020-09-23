const KafkaConsumer = require('./kafkaConsumer')

module.exports = function (ingresses, kafkaMessage) {

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
        ingresses.push({ ...data, ingress })
      });
    }
}