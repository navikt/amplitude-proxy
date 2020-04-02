const URL = require('url').URL;

module.exports = (url) => {
  const urlObj = new URL(url);
  if
  (
      urlObj.hostname.includes('localhost') ||
      urlObj.hostname.includes('heroku')
  ) {
    return true;
  }
  return false;
};
