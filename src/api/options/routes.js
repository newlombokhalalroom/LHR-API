const routes = (handler) => [
  {
    method: 'POST',
    path: '/options',
    handler: handler.postOptionHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/options/{optionId}',
    handler: handler.putOptionHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/options/{optionId}',
    handler: handler.deleteOptionHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/options',
    handler: handler.getOptionsHandler,
  },
];

module.exports = routes;
