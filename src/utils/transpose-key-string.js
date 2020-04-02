
const transposeKeyString = (keyString) => {
  const rawObj = JSON.parse(keyString)
  const keyMap = new Map();
  Object.keys(rawObj).forEach(key=>{
    rawObj[key].split(",").forEach(context=>{
      keyMap.set(context,key)
    })
  })
  return keyMap;
};

module.exports = transposeKeyString;
