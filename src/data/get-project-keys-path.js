const path = require('path');
module.exports = () => {
  if (process.env.PROJECT_KEYS_FILE.startsWith('.')) {
    return path.join(__dirname, '..', '..', process.env.PROJECT_KEYS_FILE);
  } else {
    return process.env.PROJECT_KEYS_FILE;
  }
};
