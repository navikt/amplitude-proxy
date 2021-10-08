const exampleEvent = require('../examples/amplitude-event');
const exampleEventAuto = require('../examples/amplitude-event-auto');
const uuid = require('uuid');
const deviceId = uuid.v4();
const sessionId = new Date().getTime();
let event_id = 1;
module.exports = (event) => {
  let exampleData;
  if (event !== undefined) {
    exampleData = exampleEventAuto;
  } else {
    exampleData = exampleEvent;
  }
  const testEvent = JSON.parse(JSON.stringify(exampleData));
  testEvent.device_id = deviceId;
  testEvent.uuid = uuid.v4();
  testEvent.event_type = require('faker').lorem.words();
  testEvent.timestamp = new Date().getTime();
  testEvent.session_id = sessionId;
  testEvent.event_id = event_id;
  event_id++;
  return testEvent;
};
