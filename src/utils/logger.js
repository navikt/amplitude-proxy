const pinoConfig = {
  timestamp: false,
  formatters: {
    level(label, number) {
      return {level: label};
    },
  },
};

if (!process.env.NAIS_CLUSTER_NAME) {
  pinoConfig.prettyPrint = {colorize: true};
}

const logger = require('pino')(pinoConfig);

module.exports = logger;


