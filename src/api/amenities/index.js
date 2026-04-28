const AmenitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'amenities',
  version: '1.0.0',
  register: async (server, { amenitiesService, AmenitiesValidator, clientTypesService }) => {
    const facilitiesHandler = new AmenitiesHandler(amenitiesService, AmenitiesValidator, clientTypesService);
    server.route(routes(facilitiesHandler));
  },
};
