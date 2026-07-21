const OrdersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'orders',
  version: '1.0.0',
  register: async (server, {
    ordersService,
    orderItemsService,
    contactsService,
    productsService,
    userDetailsService,
    clientDetailsService,
    orderProductDetailsService,
    balancesService,
    OrdersValidator,
    clientsService,
    cacheService,
    optionsService,
    orderOptionsItemsService,
    sendEmailService,
    reviewsService,
    partnerHotelsService,
  }) => {
    const ordersHandler = new OrdersHandler(
      ordersService,
      orderItemsService,
      contactsService,
      productsService,
      userDetailsService,
      clientDetailsService,
      orderProductDetailsService,
      balancesService,
      OrdersValidator,
      clientsService,
      cacheService,
      optionsService,
      orderOptionsItemsService,
      sendEmailService,
      reviewsService,
      partnerHotelsService,
    );
    server.route(routes(ordersHandler));
  },
};
