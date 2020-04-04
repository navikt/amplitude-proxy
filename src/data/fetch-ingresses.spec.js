const assert = require('assert');
const axios = require('axios');
const moxios = require('moxios');
const fetchIngresses = require('./fetch-ingresses');
const mockIngresses = require('../../test-utils/mock-ingresses-moxios');
const randomizeIngressPath = require('../../test-utils/randomize-ingress-path');

describe('fetch-ingresses', function() {
  beforeEach(() => {
    randomizeIngressPath();
    moxios.install();
  });
  afterEach(() => moxios.uninstall());
  it('should fetch ingresses', async function() {
    const fetchIngressesUrl = 'http://localhost:3333/ingresses.json';
    mockIngresses(moxios, fetchIngressesUrl);
    const result = await fetchIngresses(fetchIngressesUrl);
    assert.strictEqual(result, true);
  });
  it('should not fetch ingresses if error', async function() {
    const fetchIngressesUrl = 'http://localhost:9999/ingresses.json';
    moxios.stubRequest(fetchIngressesUrl, {
      status: 200,
      responseText: [],
    });
    const result = await fetchIngresses(fetchIngressesUrl);
    assert.strictEqual(result, false);
  });
});
