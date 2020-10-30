module.exports = (hostname) => {
  if
  (
      //hostname.includes('localhost') ||
      hostname.includes('heroku')
  ) {
    return true;
  }
  return false;
};
