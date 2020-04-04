const ingressData = require('./generate-ingresses-data');
const mockIngressServer = (moxios, fetchIngressesUrl) => {
  return moxios.stubRequest(fetchIngressesUrl, {
    status: 200,
    responseText: JSON.stringify(ingressData()),
  });

};

module.exports = mockIngressServer;
