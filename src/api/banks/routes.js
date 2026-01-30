const routes = (handler) => [
  {
    method: 'POST',
    path: '/banks',
    handler: handler.postBanksHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/banks/{bankId}',
    handler: handler.putBankHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/banks',
    handler: handler.getBanksHandler,
  },
];

module.exports = routes;
