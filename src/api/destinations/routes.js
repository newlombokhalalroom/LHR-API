const routes = (handler) => [
  {
    method: 'POST',
    path: '/super-admin/destinations',
    handler: handler.postDestinationHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/destinations/{id}',
    handler: handler.getDestinationHandlerById,
  },
  {
    method: 'GET',
    path: '/destinations',
    handler: handler.getDestinationsHandler,
  },
  {
    method: 'GET',
    path: '/destinations/categories',
    handler: handler.getDestinationCategoriesHandler,
  },
  {
    method: 'GET',
    path: '/super-admin/destinations',
    handler: handler.getAllDestinationsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/super-admin/destinations/{id}',
    handler: handler.updateDestinationHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
    },
  },
  {
    method: 'DELETE',
    path: '/super-admin/destinations/{id}',
    handler: handler.deleteDestinationHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
    },
  },
];

module.exports = routes;
