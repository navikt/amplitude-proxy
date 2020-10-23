const { Kafka } = require('kafkajs');
const ExampleMessage = require('../examples/kafka-message.json')

module.exports = async function () {
  const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS] })

  const producer = kafka.producer()
  await producer.connect()

  for (x = 0; x < 2010; x++) {
    const ingress = "https://test.test.test"
    const key = "12345abcde"
    const newKey = x + key
    const newIngress = ingress + x
    const newExample = ExampleMessage
    newExample.object.spec.ingresses = [newIngress]
    await producer.send({
      topic: 'dataplattform.ingress-topic',
      messages: [
        { key: newKey, value: JSON.stringify(newExample) },
      ],
    })
  }

  await producer.disconnect()
}