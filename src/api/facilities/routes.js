const routes = (handler) => [
  {
    method: 'POST',
    path: '/facilities',
    handler: handler.postFacilityHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/facilities',
    handler: handler.getFacilitiesHandler,
  },
  {
    method: 'PUT',
    path: '/facilities/{id}',
    handler: handler.putFacilityHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/facilities/{id}',
    handler: handler.deleteFacilityHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
];

module.exports = routes;
