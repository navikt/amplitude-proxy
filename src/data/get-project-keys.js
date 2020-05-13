const fs = require('fs');
const getProjectKeysPath = require('./get-project-keys-path');
const transposeKeyString = require('../utils/transpose-key-string');
module.exports = () => {
  const projectKeysString = fs.readFileSync(getProjectKeysPath(), 'utf-8');
  return transposeKeyString(projectKeysString);
};
