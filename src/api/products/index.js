const ProductsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'products',
  version: '1.0.0',
  register: async (server, {
    productsService,
    amenitiesService,
    clientsService,
    productPicturesService,
    detailsService,
    productsDetailsService,
    productsAmenitiesService,
    ProductsValidator,
    productItemsService,
    unavailableStatusService,
    optionsService,
    productsOptionsService,
    productsPoliciesService,
    policiesService,
    reviewsService,
  }) => {
    const productsHandler = new ProductsHandler(
      productsService,
      amenitiesService,
      clientsService,
      productPicturesService,
      detailsService,
      productsDetailsService,
      productsAmenitiesService,
      ProductsValidator,
      productItemsService,
      unavailableStatusService,
      optionsService,
      productsOptionsService,
      productsPoliciesService,
      policiesService,
      reviewsService,
    );
    server.route(routes(productsHandler));
  },
};
