const routes = (handler) => [
  {
    method: 'POST',
    path: '/cards',
    handler: handler.postCardsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user', 'admin', 'super-admin'],
      },
    },
  },
  {
    method: 'GET',
    path: '/cards',
    handler: handler.getCardsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user', 'admin', 'super-admin'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/cards',
    handler: handler.putCardsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['user', 'admin', 'super-admin'],
      },
    },
  },

  // SUPER ADMIN: get card by id
  {
    method: 'GET',
    path: '/cards/{id}',
    handler: handler.getCardByIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
    },
  },

  // SUPER ADMIN: get all cards
  {
    method: 'GET',
    path: '/super-admin/cards',
    handler: handler.getAllCardsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
    },
  },
];

module.exports = routes;
