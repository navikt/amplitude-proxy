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
  }

  if (kafkaMessage.object.spec.ingresses) {
    kafkaMessage.object.spec.ingresses.forEach(ingressRaw => {
      const ingress = ingressRaw.replace(/\/$/, '');
      newIngresses.push({ ...data, ingress })
    });
  }

  newIngresses.forEach((newIngress) => {
    ingresses.set(newIngress.ingress, newIngress)

    fs.appendFile(path.resolve(__dirname, '..', 'resources', 'messages.txt'), JSON.stringify(newIngress) + '\r\n', function (err) {
      if (err) return console.log(err);
      console.log("added");
  })
  })
}