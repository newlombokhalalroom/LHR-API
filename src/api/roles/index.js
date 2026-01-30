const RolesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'roles',
  version: '1.0.0',
  register: async (server, { userRolesService, UserRolesValidator }) => {
    const rolesHandler = new RolesHandler(userRolesService, UserRolesValidator);
    server.route(routes(rolesHandler));
  },
};
