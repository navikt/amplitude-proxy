const validUrl = require('./valid-url');
const cleanUrl = require('./clean-url');
module.exports = (obj) => {
  const cloneObj = {...obj};
  Object.keys(cloneObj).forEach(function(key) {
    if(cloneObj[key] instanceof Object) {
      Object.keys(cloneObj[key]).forEach((nestedKey) => {
        if (validUrl(cloneObj[key][nestedKey])) {
          cloneObj[key][nestedKey] = cleanUrl(cloneObj[key][nestedKey]);
        }
      })
    }
    if (validUrl(cloneObj[key])) {
      cloneObj[key] = cleanUrl(cloneObj[key]);
    }
  });
  return cloneObj;
};

