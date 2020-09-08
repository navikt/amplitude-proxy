const kafkaClient = require("./kafka-client")
describe('kafka-client', () => {
  it('should work', () => {
    const dsf = kafkaClient;
    console.log(dsf);
  });
});
