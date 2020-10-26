const { Kafka } = require('kafkajs');
const fs = require('fs');
const shortid = require('shortid');
const logger = require('../utils/logger');
const fetchKafkaIngresses = require('./fetchKafkaIngresses');
const { exception } = require('console');

module.exports = async function (ingressList, isAliveStatus, isReadyStatus) {
  try {
    const kafkaBrokers = process.env.KAFKA_BROKERS.split(",");
    const kafkaConfig = { brokers: [...kafkaBrokers] }

    if (!kafkaBrokers[0].includes('localhost')) {
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
        if(ingressList.size % 100 === 0){
          logger.info("Ingress size: " + ingressList.size)
        }
        
        if(ingressList.size > 2000 && kafkaBrokers[0].includes('localhost')) {
          consumer.disconnect()
        }

      }
    })

  } catch (e) {
    logger.error("Kafka error:" + e.message)
    isAliveStatus.status = false
    isAliveStatus.message = e
  }
};