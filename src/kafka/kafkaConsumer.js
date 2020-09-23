const { Kafka } = require('kafkajs');
const fs = require('fs');
const shortid = require('shortid');
const logger = require('../utils/logger');

let ingresses = [
  {
    "app": "enonicxp",
    "team": "enonic",
    "namespace": "enonic",
    "version": "unknown",
    "context": "prod",
    "ingress": "https://www.nav.no/no"
  },
  {
    "app": "enonicxp",
    "team": "enonic",
    "namespace": "enonic",
    "version": "unknown",
    "context": "prod",
    "ingress": "https://www.nav.no/en"
  },
  {
    "app": "enonicxp",
    "team": "enonic",
    "namespace": "enonic",
    "version": "unknown",
    "context": "prod",
    "ingress": "https://www.nav.no/se"
  },
  {
    "app": "enonicxp",
    "team": "enonic",
    "namespace": "enonic",
    "version": "unknown",
    "context": "prod",
    "ingress": "https://www.nav.no"
  },
  {
    "app": "enonicxp",
    "team": "enonic",
    "namespace": "enonic",
    "version": "unknown",
    "context": "prod",
    "ingress": "https://tjenester.nav.no/nav-sok"
  },
  {
    "app": "iaweb",
    "team": "arbeidsgiver",
    "namespace": "iaweb",
    "version": "unknown",
    "context": "prod",
    "ingress": "https://tjenester.nav.no/iaweb"
  },
  {
    "app": "dokumentinnsending",
    "team": "teamdokumenthandtering",
    "namespace": "dokumentinnsending",
    "version": "unknown",
    "context": "prod",
    "ingress": "https://tjenester.nav.no/dokumentinnsending"
  },
  {
    "app": "bidragskalkulator",
    "team": "orphans",
    "namespace": "dokumentinnsending",
    "version": "unknown",
    "context": "prod",
    "ingress": "https://tjenester.nav.no/bidragskalkulator"
  },
  {
    "app": "pensjon-pselv",
    "team": "teampensjon",
    "namespace": "default",
    "version": "unknown",
    "context": "prod",
    "ingress": "https://tjenester.nav.no/pselv"
  }
]

module.exports = async function () {

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
          ingresses.push({...messageData, ingress})
        });
      }
    },
  })

  logger.info(ingresses)
};