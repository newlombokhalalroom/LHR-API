const PartnerHotelsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'partnerHotels',
  version: '1.0.0',
  register: async (server, { service, validator, clientsService }) => {
    const partnerHotelsHandler = new PartnerHotelsHandler(service, validator, clientsService);
    server.route(routes(partnerHotelsHandler));
  },
};
