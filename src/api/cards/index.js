const CardsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'cards',
  version: '1.0.0',
  register: async (server, { banksService, cardsService, CardsValidator }) => {
    const cardsHandler = new CardsHandler(banksService, cardsService, CardsValidator);
    server.route(routes(cardsHandler));
  },
};
