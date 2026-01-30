const DestinationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'destinations',
  version: '1.0.0',
  register: async (server, { DestinationsValidator, destinationsService, destinationPicturesService }) => {
    const destinationsHandler = new DestinationsHandler(DestinationsValidator, destinationsService, destinationPicturesService);
    server.route(routes(destinationsHandler));
  },
};
