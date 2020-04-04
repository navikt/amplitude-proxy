const path = require('path');
module.exports = () => process.env.INGRESSES_PATH || path.resolve(__dirname, '..', '..', 'cache', 'ingresses.json');
