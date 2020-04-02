const logger = require('pino')({
  timestamp: false,
  formatters: {
    level (label, number) {
      return { level: label }
    }
  },
});

module.exports = logger;


