const validUrl = require('./valid-url');
const cleanUrl = require('./clean-url');
module.exports = (obj) => {
  const cloneObj = {...obj};
  Object.keys(cloneObj).forEach(function(key) {
    if (validUrl(cloneObj[key])) {
      cloneObj[key] = cleanUrl(cloneObj[key]);
    }
  });
  return cloneObj;
};

