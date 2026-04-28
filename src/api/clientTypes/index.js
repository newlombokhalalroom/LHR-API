const ClientTypesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'clientTypes',
  version: '1.0.0',
  register: async (server, { clientTypesService, ClientTypesValidator }) => {
    const clientTypesHandler = new ClientTypesHandler(clientTypesService, ClientTypesValidator);
    server.route(routes(clientTypesHandler));
  },
};
