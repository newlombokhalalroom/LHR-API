const PoliciesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'policies',
  version: '1.0.0',
  register: async (server, { policiesService, clientTypesService, PoliciesValidator }) => {
    const policiesHandler = new PoliciesHandler(policiesService, clientTypesService, PoliciesValidator);
    server.route(routes(policiesHandler));
  },
};
