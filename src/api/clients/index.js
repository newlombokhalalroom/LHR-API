const ClientsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'clients',
  version: '1.0.0',
  register: async (
    server,
    {
      clientsService,
      clientTypesService,
      ClientsValidator,
      clientPicturesService,
      clientsFacilitiesService,
      locationsService,
      policiesService,
      clientsPoliciesService,
      productsService,
      productPicturesService,
      productItemsService,
      ProductsValidator,
    },
  ) => {
    const clientsHandler = new ClientsHandler(
      clientsService,
      clientTypesService,
      ClientsValidator,
      clientPicturesService,
      clientsFacilitiesService,
      locationsService,
      policiesService,
      clientsPoliciesService,
      productsService,
      productPicturesService,
      productItemsService,
      ProductsValidator,
    );
    server.route(routes(clientsHandler));
  },
};
