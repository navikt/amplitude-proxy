const validUrl = require('./valid-url');
const cleanUrl = require('./clean-url');
module.exports = (obj) => {
  const cloneObj = {...obj};
  Object.keys(cloneObj).forEach(function(key) {
    if(cloneObj[key] instanceof Object) {
      Object.keys(cloneObj[key]).forEach((nestedKey) => {
        if (validUrl(cloneObj[key][nestedKey]) || nestedKey === 'pagePath') {
          cloneObj[key][nestedKey] = cleanUrl(cloneObj[key][nestedKey]);
        }
      })
    }
    if (validUrl(cloneObj[key]) || key === 'pagePath') {
      cloneObj[key] = cleanUrl(cloneObj[key]);
    }
  });
  return cloneObj;
};

