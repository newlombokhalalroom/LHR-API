const OptionsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'options',
  version: '1.0.0',
  register: async (server, { OptionsValidator, clientTypesService, optionsService }) => {
    const optionsHandler = new OptionsHandler(OptionsValidator, clientTypesService, optionsService);
    server.route(routes(optionsHandler));
  },
};
