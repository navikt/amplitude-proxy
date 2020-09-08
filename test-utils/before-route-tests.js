const mockIngressesMoxios = require('./mock-ingresses-moxios');
const buildServer = require('../src/server');
const nodemonConfig = require('../nodemon');
const client = require('prom-client');

module.exports = async (moxios) =>{
  Object.keys(nodemonConfig.env).forEach(key => {
    process.env[key] = nodemonConfig.env[key];
  });
  await mockIngressesMoxios(moxios, process.env.INGRESSES_URL);
  moxios.install();
  client.register.clear();
  return await buildServer();
}
