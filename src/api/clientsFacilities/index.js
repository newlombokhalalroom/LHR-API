const ClientsFacilitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'clientsFacilities',
  version: '1.0.0',
  register: async (server, {
    clientsFacilitiesService,
    clientsService,
    facilitiesService,
    ClientsFacilitiesValidator,
  }) => {
    const clientsFacilitiesHandler = new ClientsFacilitiesHandler(clientsFacilitiesService, clientsService, facilitiesService, ClientsFacilitiesValidator);
    server.route(routes(clientsFacilitiesHandler));
  },
};
