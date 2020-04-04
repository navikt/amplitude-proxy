module.exports = (urlRaw, map) => {
  const url = urlRaw.replace(/\/$/, '');
  const parts = url.split('/');
  let entry;
  for (let i = 7; i >= 3; i--) {
    if (parts.length >= i) {
      entry = map.get(parts.slice(0, i).join('/'));
      if (entry) {
        break;
      }
    }
  }
  return entry;
};

