const FacilitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'facilities',
  version: '1.0.0',
  register: async (server, { facilitiesService, clientTypesService, FacilitiesValidator }) => {
    const facilitiesHandler = new FacilitiesHandler(facilitiesService, clientTypesService, FacilitiesValidator);
    server.route(routes(facilitiesHandler));
  },
};
