const routes = (handler) => [
  {
    method: 'POST',
    path: '/super-admin/amenities',
    handler: handler.postAmenityHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/amenities',
    handler: handler.getAmenitiesHandler,
  },
  {
    method: 'GET',
    path: '/amenities/{id}',
    handler: handler.getAmenityHandler,
  },
  {
    method: 'PUT',
    path: '/super-admin/amenities/{id}',
    handler: handler.updateAmenityHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/super-admin/amenities/{id}',
    handler: handler.deleteAmenityHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
];

module.exports = routes;
