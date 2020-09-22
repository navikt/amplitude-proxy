const { Kafka } = require('kafkajs');
const fs = require('fs');
const shortid = require('shortid');
const logger = require('../utils/logger');

module.exports = async function () {
  const kafka = new Kafka({
    brokers: process.env.KAFKA_BROKERS,
    ssl: {
      rejectUnauthorized: false,
      ca: [fs.readFileSync(process.env.KAFKA_CA_PATH, 'utf-8')],
      key: fs.readFileSync(process.env.KAFKA_PRIVATE_KEY_PATH, 'utf-8'),
      cert: fs.readFileSync(process.env.KAFKA_CERTIFICATE_PATH, 'utf-8')
    },
  })

  const consumer = kafka.consumer({ groupId: `amplitude_proxy_${shortid.generate()}` })

  await consumer.connect()
  await consumer.subscribe({ topic: 'dataplattform.ingress-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logger.info({
        value: message.value.toString(),
      })
    },
  })
};