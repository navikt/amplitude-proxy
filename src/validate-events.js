const Ajv = require('ajv');
const ajv = new Ajv();
const validateEvent = ajv.compile(require('./schemas/event'));

module.exports = function(events) {
  const errors = [];
  events.forEach(event => {
    const result = validateEvent(event);
    if (!result) errors.push(validateEvent.errors);
  });
  return errors;
};
