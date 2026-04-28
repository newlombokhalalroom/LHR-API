const routes = (handler) => [
  {
    method: 'POST',
    path: '/roles',
    handler: handler.postRolesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
];

module.exports = routes;
