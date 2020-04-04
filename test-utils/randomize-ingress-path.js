const os = require('os');
const uuid = require('uuid');
const path = require('path');
module.exports = function() {
  process.env.INGRESSES_PATH = path.join(os.tmpdir() + '/' + uuid.v4() + '.json');
};
