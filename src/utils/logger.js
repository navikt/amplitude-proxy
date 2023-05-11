const { isOnNais } = require('./is-on-nais');

const pinoConfig = {
  timestamp: false,
  formatters: {
    level(label, number) {
      return { level: label };
    },
  },
};

if (!isOnNais()) {
  pinoConfig.transport = {
    target: 'pino-pretty',
    options: {
      colorize: false
    }
  };
}

const logger = require('pino')(pinoConfig);

module.exports = logger;


