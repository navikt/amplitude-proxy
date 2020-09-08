const { Kafka } = require('kafkajs')

module.exports =  new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: (process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9292').split(','),
})
