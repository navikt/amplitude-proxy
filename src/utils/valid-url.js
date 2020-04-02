const URL = require('url').URL;

module.exports = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};
