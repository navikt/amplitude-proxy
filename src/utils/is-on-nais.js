const isOnNais = () => {
  return !!(process.env.NAIS_APP_NAME &&
      process.env.NAIS_NAMESPACE &&
      process.env.NAIS_APP_IMAGE);
};

module.exports = {isOnNais};
