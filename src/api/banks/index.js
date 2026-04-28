const BanksHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'banks',
  version: '1.0.0',
  register: async (server, { BanksValidator, banksService }) => {
    const banksHandler = new BanksHandler(BanksValidator, banksService);
    server.route(routes(banksHandler));
  },
};
