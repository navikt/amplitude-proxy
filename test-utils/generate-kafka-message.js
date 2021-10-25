const {Kafka} = require('kafkajs');
const ExampleMessage = require('../examples/kafka-message.json');
const generateIngressUpdate = require('./generate-ingress-update');
const logger = require('../src/utils/logger');
const shortid = require('shortid');

module.exports = async function() {
  const logName = 'generate-kafka-message';
  const kafkaBrokers = process.env.KAFKA_BROKERS.split(',');
  const kafka = new Kafka({
    clientId: logName,
    brokers: [...kafkaBrokers],
  });

  const consumer = kafka.consumer({
    groupId: logName + '_' + shortid.generate(),
  });
  await consumer.connect();
  await consumer.subscribe({topic: process.env.KAFKA_INGRESS_TOPIC, fromBeginning: true});
  logger.info({msg: 'Consumer connected: ' + process.env.KAFKA_INGRESS_TOPIC, name: logName});
  let count = 0;
  await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      count++;
    },
  });
  await new Promise(function(resolve, reject) {
    let lastObserved = -1;
    const intervalHandle = setInterval(function() {
      if (lastObserved === count) {
        clearInterval(intervalHandle)
        resolve();
      } else {
        lastObserved = count;
      }
    }, 200);
  });
  await consumer.disconnect();
  logger.info({msg: 'Total messages: ' + count, name: logName});
  if(count<4000){
    const producer = kafka.producer();
    producer.on(producer.events.CONNECT, () => {
      logger.info({msg: 'Producer is connected!', name: logName});
    });
    await producer.connect();

    let messages = [];
    const numbOfMessages = 4010;
    const sendPromises = [];

    for (let x = 0; x <= numbOfMessages; x++) {
      const newExample = Object.assign({}, ExampleMessage);
      const mockData = generateIngressUpdate();
      newExample.object.spec.ingresses = mockData.ingresses;
      newExample.object.metadata.name = mockData.props.app;
      newExample.object.metadata.uid = mockData.uid;
      newExample.object.metadata.namespace = mockData.props.namespace;
      newExample.cluster = mockData.props.context;
      newExample.object.metadata.labels.team = mockData.props.team;
      messages.push({key: '12345abcde' + x, value: JSON.stringify(newExample)});
      if (messages.length === 200 || x === numbOfMessages) {
        sendPromises.push(producer.send({
          topic: process.env.KAFKA_INGRESS_TOPIC,
          messages,
        }));
        messages = [];
      }
    }
    await Promise.all(sendPromises);
    logger.info({msg: 'Finished posting test data!', name: logName, batches: sendPromises.length});
    await producer.disconnect();
  } else {
    logger.info({msg: 'Skipping testdata generation', name: logName})
  }
};
