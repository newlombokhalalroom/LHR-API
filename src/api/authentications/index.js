const AuthenticationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authenticationsService,
    usersService,
    tokenManager,
    authenticationsValidator,
  }) => {
    const authenticationHandler = new AuthenticationHandler(
      authenticationsService,
      usersService,
      tokenManager,
      authenticationsValidator,
    );
    server.route(routes(authenticationHandler));
  },
};
