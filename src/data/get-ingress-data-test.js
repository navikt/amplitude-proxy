const lookupFunction = require('./lookup-function');
const logger = require('../utils/logger');

const getIngressDataTest = (url, ingresses) => {

  return lookupFunction(url, ingresses);
};

module.exports = getIngressDataTest;
