const fs = require('fs');
const path = require('path');
const os = require('os');

const logFilepath = path.join(os.tmpdir(), 'ingresses.log');
const ingressLogStream = fs.createWriteStream(logFilepath);
const ingressLog = (app, cluster, ingress, createdTime) => {
  return (status) => {
    ingressLogStream.write(JSON.stringify({app, cluster, status, ingress, createdTime}) + os.EOL);
  };
};

module.exports = {
  ingressLog,
  ingressLogStream,
};
