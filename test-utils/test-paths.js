const paths = require('../src/paths');
const port = 9832;
const hostname = '127.0.0.1';
const baseUrl = 'http://' + hostname + ':' + port;
const collectUrl = baseUrl + paths.COLLECT;
const collectAutoUrl = baseUrl + paths.COLLECT_AUTO;
const collectUrlDebug = collectUrl + '?debug=1';
const collectAutoUrlDebug = collectAutoUrl + '?debug=1';

module.exports = {
  port,
  hostname,
  baseUrl,
  collectUrl,
  collectAutoUrl,
  collectUrlDebug,
  collectAutoUrlDebug,
};
