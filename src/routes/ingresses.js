const paths = require('../paths');
const constants = require('../constants');
const receiveIngressUpdate = require('../data/receive-ingress-update');
const handler = (request, reply) => {
  try {
    request.body.forEach(async ingressUpdate => {
      await receiveIngressUpdate(ingressUpdate);
    });
    reply.send(constants.SUCCESS);
  } catch (e) {
    reply.code(500).send(e.message);
  }
};

/**
 *
 * @type RouteOptions
 */
module.exports = {
  method: 'POST',
  url: paths.INGRESSES,
  schema: {
    body: {
      type: 'array',
      body: { $ref: 'ingressUpdate#' },
    },
  },
  handler
};
