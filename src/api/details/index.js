const DetailsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'details',
  version: '1.0.0',
  register: async (server, {
    detailsService, detailCategoriesService, typesService, DetailsValidator,
  }) => {
    const detailsHandler = new DetailsHandler(detailsService, detailCategoriesService, typesService, DetailsValidator);
    server.route(routes(detailsHandler));
  },
};
