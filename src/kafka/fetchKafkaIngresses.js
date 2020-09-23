const KafkaConsumer = require('./kafkaConsumer')

module.exports = function (kafkaMessages) {

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

  kafkaMessages.forEach(message => {

    const data = {
      app: message.object.metadata.name,
      team: message.object.metadata.labels.team,
      namespace: message.object.metadata.namespace,
      version: message.object.spec.image.split(':').pop(),
      context: message.cluster,
    }

    if (message.object.spec.ingresses) {
        message.object.spec.ingresses.forEach(ingressRaw => {
        const ingress = ingressRaw.replace(/\/$/, '');
        ingresses.push({ ...data, ingress })
      });
    }
  })

  return ingresses
}