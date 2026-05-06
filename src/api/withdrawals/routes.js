const routes = (handler) => [
  {
    method: 'POST',
    path: '/withdrawals',
    handler: handler.postWithdrawalsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user', 'admin'],
      },
    },
  },
  {
    method: 'GET',
    path: '/withdrawals',
    handler: handler.getWithdrawalsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
      },
    },
  },
  {
    method: 'GET',
    path: '/withdrawals/{id}',
    handler: handler.getWithdrawalsByIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
      },
    },
  },
  {
    method: 'PUT',
    path: '/withdrawals/{id}',
    handler: handler.putWithdrawalsStatusHandler,
    options: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
    },
  },
  // temp balance route
  {
    method: 'GET',
    path: '/super-admin/balance',
    handler: handler.getTotalLiabilityHandler,
    options: {
      auth: { strategy: 'lombokhalalroom_jwt', scope: ['super-admin'] },
      tags: ['api', 'super-admin', 'metrics'],
      description: 'Sum all balances excluding current super-admin',
    },
  },
];

module.exports = routes;
