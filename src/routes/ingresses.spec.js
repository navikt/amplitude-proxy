const assert = require('assert');
const moxios = require('moxios');
const beforeRouteTest = require('../../test-utils/before-route-tests');
const ingressUpdate = require('../../test-utils/generate-ingress-update');
const ingressesRoute = require('./ingresses');
const constants = require('../constants');
describe('ingresses', function() {

  let fastify;
  before(async () => {
    fastify = await beforeRouteTest(moxios)
  });
  after(() => {
    moxios.uninstall();
  });

  it('should inject route', async function() {
    await fastify.inject({
      method: ingressesRoute.method,
      url: ingressesRoute.url,
      payload: ingressUpdate(),
      headers: {},
    }).then((response) => {
      assert.equal(response.body, constants.SUCCESS)

    });
  });

});
