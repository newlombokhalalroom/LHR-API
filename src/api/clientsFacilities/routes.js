const routes = (handler) => [
  {
    method: 'POST',
    path: '/clients/facilities',
    handler: handler.postClientsFacilities,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/clients/facilities',
    handler: handler.deleteClientsFaclities,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
];

module.exports = routes;
