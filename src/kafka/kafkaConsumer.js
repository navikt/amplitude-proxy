const logger = require('../utils/logger');
const fetchKafkaIngresses = require('./fetchKafkaIngresses');
const ignoreList = require('../resources/ignoreList.json');
const promClient = require('prom-client');
const ignoreAppList = new Map();

const kafkaErrorCounter = new promClient.Counter({
  name: 'amplitude_proxy_kafka_error',
  help: 'Count of kafka error for amplitude proxy',
  labelNames: ['message'],
});

module.exports = async function(consumer, ingressList, isAliveStatus, isReadyStatus) {
  ignoreList.forEach(data => ignoreAppList.set(data.ingress, data));

  try {
    await consumer.connect();
    await consumer.subscribe({topic: process.env.KAFKA_INGRESS_TOPIC, fromBeginning: true});
    logger.info('Kafka connected: ' + process.env.KAFKA_INGRESS_TOPIC);
    await consumer.run({
      eachMessage: ({topic, partition, message}) => {
        const jsonMessage = JSON.parse(message.value);
        fetchKafkaIngresses(ingressList, jsonMessage, isReadyStatus, ignoreAppList);
      },
    });
  } catch (e) {
    logger.error('Kafka error: ' + e.message);
    kafkaErrorCounter.labels('error_kafka_consumer').inc();
    isAliveStatus.message = e;
    isAliveStatus.status = false;
  }
};
