const { Kafka } = require('kafkajs');
const fs = require('fs');
const shortid = require('shortid');
const logger = require('../utils/logger');
const fetchKafkaIngresses = require('./fetchKafkaIngresses');

module.exports = async function (ingressList) {

  try {
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

        // logger.info({
        //   value: message.value.toString(),
        // })
        const jsonMessage = JSON.parse(message.value)
        const date = new Date(message.timestamp)
        logger.info("              ")
        logger.info(jsonMessage.object.metadata.name)
        logger.info(jsonMessage.object.metadata.creationTimestamp)
        logger.info(jsonMessage.cluster)
        logger.info(date.toISOString())
        logger.info("              ")
        fetchKafkaIngresses(ingressList, jsonMessage)
        //logger.info(ingressList.size)
      }
    })
  } catch (e) {
    logger.error("Kafka error:" + e.message)
    isAliveStatus = false
    errorKafkaConsumer = e
  }
};