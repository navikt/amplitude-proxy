const qs = require('querystring');
module.exports = (events, client) => {
  return qs.stringify({
    client: client || '55477baea93c5227d8c0f6b813653615',
    e: JSON.stringify(events),
  });
};

