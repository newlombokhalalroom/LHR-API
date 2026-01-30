const routes = (handler) => [
  {
    method: 'PUT',
    path: '/contacts',
    handler: handler.updateContactHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
  {
    method: 'GET',
    path: '/contacts',
    handler: handler.getContactByUserIdHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
];

module.exports = routes;
