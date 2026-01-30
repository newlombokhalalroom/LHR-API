const routes = (handler) => [
  {
    method: 'POST',
    path: '/details',
    handler: handler.postDetailProduct,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/details',
    handler: handler.getDetailsProduct,
  },
  {
    method: 'POST',
    path: '/details/categories',
    handler: handler.postDetailCategoriesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/details/categories/{id}',
    handler: handler.putDetailCategoriesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/details/categories/{id}',
    handler: handler.deleteDetailCategoriesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/details/{id}',
    handler: handler.putDetailHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/detail',
    handler: handler.getAllDetailsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/details/{id}',
    handler: handler.deleteDetailHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/details/categories',
    handler: handler.getAllDetailCategoriesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
];

module.exports = routes;
