const pinoLogger = require('../utils/logger');
const {logLevel} = require('kafkajs');
const KafkaPinoLogger = logLevelNumeric => ({namespace, level, label, log}) => {
  const {timestamp, logger, message, ...others} = log;
  const pinoLevel = {
    [logLevel.DEBUG]: 'debug',
    [logLevel.ERROR]: 'error',
    [logLevel.INFO]: 'info',
    [logLevel.WARN]: 'warn',
    [logLevel.NOTHING]: 'info',
  }[level];
  if (logLevelNumeric <= level) {
    pinoLogger[pinoLevel]({msg: message, name: 'kafkajs/' + namespace, ...others});
  }
};

module.exports = {
  KafkaPinoLogger,
};
