const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, {
    service,
    validator,
    contactsService,
    sendEmailService,
    balancesService,
  }) => {
    const userHandler = new UsersHandler(
      service,
      validator,
      contactsService,
      sendEmailService,
      balancesService,
    );
    server.route(routes(userHandler));
  },
};
