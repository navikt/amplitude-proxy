const { Kafka } = require('kafkajs');
const ExampleMessage = require('../examples/kafka-message.json')

module.exports = async function () {
  const kafkaBrokers = process.env.KAFKA_BROKERS.split(",")
  const kafka = new Kafka({ brokers: [...kafkaBrokers] })

  const producer = kafka.producer()
  await producer.connect()

  for (x = 0; x < 4010; x++) {
    const ingress = "https://test.test.test"
    const key = "12345abcde"
    const newKey = x + key
    const newIngress = ingress + x
    const newExample = ExampleMessage
    newExample.object.spec.ingresses = [newIngress]
    await producer.send({
      topic: 'dataplattform.ingress-topic-v2',
      messages: [
        { key: newKey, value: JSON.stringify(newExample) },
      ],
    })
  }

  await producer.disconnect()
}