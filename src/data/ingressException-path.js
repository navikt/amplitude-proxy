const path = require('path');
module.exports = () => process.env.INGRESS_EXCEPTION_PATH || path.resolve(__dirname,'..','resources','ingressException.json');