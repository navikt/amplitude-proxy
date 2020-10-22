const { Kafka } = require('kafkajs');
const fs = require('fs');
const shortid = require('shortid');
const logger = require('../utils/logger');
const fetchKafkaIngresses = require('./fetchKafkaIngresses');
const { exception } = require('console');

module.exports = async function (ingressList) {
  try {
    const kafkaConfig = {
      brokers: [process.env.KAFKA_BROKERS]
    }

    if(fs.readFileSync(process.env.KAFKA_CA_PATH, 'utf-8') !==  "test") {
      kafkaConfig.ssl = {
        rejectUnauthorized: false,
        ca: [fs.readFileSync(process.env.KAFKA_CA_PATH, 'utf-8')],
        key: fs.readFileSync(process.env.KAFKA_PRIVATE_KEY_PATH, 'utf-8'),
        cert: fs.readFileSync(process.env.KAFKA_CERTIFICATE_PATH, 'utf-8')
      }
    }

    const kafka = new Kafka(kafkaConfig)

    const consumer = kafka.consumer({ groupId: `amplitude_proxy_${process.env.NAIS_CLUSTER_NAME}_${shortid.generate()}` })

    await consumer.connect()
    await consumer.subscribe({ topic: 'dataplattform.ingress-topic', fromBeginning: true })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {

        // logger.info({
        //   value: message.value.toString(),
        // })
        const jsonMessage = JSON.parse(message.value)
        fetchKafkaIngresses(ingressList, jsonMessage, isReadyStatus)
        //logger.info(ingressList.size)
      }
    })
  } catch (e) {
    logger.error("Kafka error:" + e.message)
    isAliveStatus.status = false
    isAliveStatus.message = e
  }
};