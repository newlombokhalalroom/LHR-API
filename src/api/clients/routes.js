const routes = (handler) => [
  {
    method: 'GET',
    path: '/clients',
    handler: handler.getAllClientsHandler,
  },
  {
    method: 'GET',
    path: '/clients/{id}/details',
    handler: handler.getClientsByIdWithDetailsHandler,
  },
  {
    method: 'GET',
    path: '/clients/{id}/products',
    handler: handler.getClientProductsHandler,
  },
  {
    method: 'GET',
    path: '/clients/withUnapproved',
    handler: handler.getAllClientsWithUnapprovedHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['admin', 'super-admin'],
      },
    },
  },
  {
    method: 'GET',
    path: '/clients/approved',
    handler: handler.getAllClientsApprovedHandler,
  },
  {
    method: 'GET',
    path: '/clients/{id}',
    handler: handler.getClientsByIdHandler,
  },

  {
    method: 'GET',
    path: '/clients/byUser',
    handler: handler.getClientsByUser,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/clients/types',
    handler: handler.getClientTypes,
  },
  // restricted
  {
    // US-15 Melakukan Pendaftaran Mitra
    method: 'POST',
    path: '/clients',
    handler: handler.postClientsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/clients',
    handler: handler.putClientHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/clients/unapproved',
    handler: handler.getUnapprovedClientsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/clients/approve/{id}',
    handler: handler.putClientApprovalHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'POST',
    path: '/clients/pictures',
    handler: handler.postClientPicturesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/clients/pictures',
    handler: handler.deleteClientPicturesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'POST',
    path: '/clients/locations',
    handler: handler.postClientLocationHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/clients/locations',
    handler: handler.putClientLocationHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  // client's policies
  {
    method: 'POST',
    path: '/clients/policies',
    handler: handler.postClientPoliciesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/clients/policies/{policyId}',
    handler: handler.putClientPolicyHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/clients/policies/{policyId}',
    handler: handler.deleteClientPolicyHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
];

module.exports = routes;
