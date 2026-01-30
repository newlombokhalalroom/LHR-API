const routes = (handler) => [
  {
    method: 'POST',
    path: '/verifications/email',
    handler: handler.sendEmailVerificationCodeHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/verifications/email',
    handler: handler.editEmailVerifiedStatusHandler,
    options: {
      auth: 'lombokhalalroom_jwt',
    },
  },
];

module.exports = routes;
