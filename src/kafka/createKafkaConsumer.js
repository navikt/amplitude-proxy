const {logLevel, Kafka} = require('kafkajs');
const {KafkaPinoLogger} = require('./kafkaPinoLogger');
const {isOnNais} = require('../utils/is-on-nais');
const fs = require('fs');
const shortid = require('shortid');

const createKafkaConsumer = () => {
  const kafkaBrokers = process.env.KAFKA_BROKERS.split(',');

  const kafkaConfig = {
    brokers: [...kafkaBrokers],
    requestTimeout: 10000,
    logLevel: logLevel.ERROR,
    logCreator: KafkaPinoLogger,
  };

  if (isOnNais()) {
    kafkaConfig.ssl = {
      rejectUnauthorized: false,
      ca: [fs.readFileSync(process.env.KAFKA_CA_PATH, 'utf-8')],
      key: fs.readFileSync(process.env.KAFKA_PRIVATE_KEY_PATH, 'utf-8'),
      cert: fs.readFileSync(process.env.KAFKA_CERTIFICATE_PATH, 'utf-8'),
    };
  }

  const kafka = new Kafka(kafkaConfig);

  return kafka.consumer({
    groupId: `amplitude_proxy_${process.env.NAIS_CLUSTER_NAME}_${shortid.generate()}`,
  });
};

module.exports = {
  createKafkaConsumer,
};
