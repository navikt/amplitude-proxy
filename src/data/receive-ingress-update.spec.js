const receiveIngressUpdate = require("./receive-ingress-update");
const exampleIngressUpdateMessage = require("../../examples/ingress-update.json");
describe('receive-ingress-update', function() {
  it('should handle stuff', async function() {
    const res = await receiveIngressUpdate(exampleIngressUpdateMessage);
    console.log(res)
  });
});
