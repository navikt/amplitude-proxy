const { Kafka } = require('kafkajs');
const fs = require('fs');
const shortid = require('shortid');
const logger = require('../utils/logger');

module.exports = async function (ingressesList) {

  const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKERS],
    ssl: {
      rejectUnauthorized: false,
      ca: [fs.readFileSync(process.env.KAFKA_CA_PATH, 'utf-8')],
      key: fs.readFileSync(process.env.KAFKA_PRIVATE_KEY_PATH, 'utf-8'),
      cert: fs.readFileSync(process.env.KAFKA_CERTIFICATE_PATH, 'utf-8')
    },
  })

  const consumer = kafka.consumer({ groupId: `amplitude_proxy_${process.env.NAIS_CLUSTER_NAME}_${shortid.generate()}` })

  await consumer.connect()
  await consumer.subscribe({ topic: 'dataplattform.ingress-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      logger.info({
        value: message.value.toString(),
      })
      const jsonMessage = JSON.parse(message.value)

      const messageData = {
        app: jsonMessage.object.metadata.name,
        team: jsonMessage.object.metadata.labels.team,
        namespace: jsonMessage.object.metadata.namespace,
        version: jsonMessage.object.spec.image.split(':').pop(),
        context: jsonMessage.cluster,
      }
      if (jsonMessage.object.spec.ingresses) {
          jsonMessage.object.spec.ingresses.forEach(ingressRaw => {
          const ingress = ingressRaw.replace(/\/$/, '');
          ingressesList.push({...messageData, ingress})
        });
      }
    },
  })
};