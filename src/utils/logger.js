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
    options: {
      colorize: true
    }
  };
}

const logger = require('pino')(pinoConfig);

module.exports = logger;


