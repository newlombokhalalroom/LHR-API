const routes = (handler) => [
  {
    method: 'POST',
    path: '/super-admin/advertisements',
    handler: handler.postAdvertisementHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/super-admin/advertisements',
    handler: handler.getAllAdvertisementsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/super-admin/advertisements/{id}',
    handler: handler.getAdvertisementByIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/super-admin/advertisements/{id}',
    handler: handler.putAdvertisementByIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/super-admin/advertisements/{id}',
    handler: handler.deleteAdvertisementByIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
];

module.exports = routes;
