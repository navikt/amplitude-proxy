const fs = require('fs');
const getProjectKeysPath = require('./get-project-keys-path');
const transposeKeyString = require('../utils/transpose-key-string');
module.exports = () => {
  const projectKeysString = process.env.PROJECT_KEYS ?
      process.env.PROJECT_KEYS :
      fs.readFileSync(getProjectKeysPath(), 'utf-8');
  return transposeKeyString(projectKeysString);
};
