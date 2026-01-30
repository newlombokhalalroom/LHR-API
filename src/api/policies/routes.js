const routes = (handler) => [
  {
    method: 'POST',
    path: '/policies',
    handler: handler.postPolicyHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/policies',
    handler: handler.getPoliciesHandler,
  },
  {
    method: 'PUT',
    path: '/policies/{id}',
    handler: handler.updatePolicyHandler,
    options: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: ['super-admin'],
      },
      description: 'Update policy by ID (partial allowed)',
      tags: ['api', 'super-admin', 'policies'],
    },
  },
  {
    method: 'DELETE',
    path: '/policies/{id}',
    handler: handler.deletePolicyHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'super-admin',
      },
    },
  },
];

module.exports = routes;
