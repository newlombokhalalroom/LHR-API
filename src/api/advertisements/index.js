const AdvertisementsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'advertisements',
  version: '1.0.0',
  register: async (server, { advertisementsService, AdvertisementsValidator }) => {
    const advertisementsHandler = new AdvertisementsHandler(
      advertisementsService,
      AdvertisementsValidator,
    );
    server.route(routes(advertisementsHandler));
  },
};
