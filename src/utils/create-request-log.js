module.exports = (projectKey, eventType, deviceId, userAgent) => {
  return function(msg) {
    return {
      msg,
      project_key: projectKey,
      event_type: eventType,
      device_id: deviceId,
      user_agent: userAgent,
    };
  };
};
