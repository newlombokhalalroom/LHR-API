const WithdrawalsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'withdrawals',
  version: '1.0.0',
  register: async (server, { cardsService, balancesService, withdrawalsService, WithdrawalsValidator }) => {
    const withdrawalsHandler = new WithdrawalsHandler(cardsService, balancesService, withdrawalsService, WithdrawalsValidator);
    server.route(routes(withdrawalsHandler));
  },
};
