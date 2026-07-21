const routes = (handler) => [
  {
    method: 'POST',
    path: '/partner-hotels',
    handler: handler.postPartnerHotelHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
  {
    method: 'GET',
    path: '/partner-hotels/me',
    handler: handler.getMyPartnerHotelsHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
  {
    method: 'GET',
    path: '/clients/{id}/partner-hotels',
    handler: handler.getPartnerHotelsByClientIdHandler,
  },
  {
    method: 'GET',
    path: '/partner-hotels/{id}',
    handler: handler.getPartnerHotelByIdHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/partner-hotels/{id}',
    handler: handler.putPartnerHotelByIdHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/partner-hotels/{id}',
    handler: handler.deletePartnerHotelByIdHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
];

module.exports = routes;
