
module.exports = (userAgent) => {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  if(userAgent){
    config.headers['user-agent'] = userAgent;
  }
  return config;
};

