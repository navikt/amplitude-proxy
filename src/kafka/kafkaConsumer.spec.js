const assert = require('assert');
const kafkaConsumer = require('./kafkaConsumer')

describe('Kafka connection test', function () {
  const ingessMap = new Map()
  it('Kafka should change is alive status global variable when unable to connect', function () {
    kafkaConsumer(ingessMap).then(
    assert.strictEqual(isAliveStatus, false)
    )
  });

});
