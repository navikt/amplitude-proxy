const KafkaConsumer = require('../kafka/kafkaConsumer');

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

const handler = (request, reply) => {
  KafkaConsumer(ingresses)
  reply.send(ingresses)
};

module.exports = {
  method: 'GET',
  url: "/ingresses",
  handler
};