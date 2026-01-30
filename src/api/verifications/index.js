const EmailVerificationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'verification',
  version: '1.0.0',
  register: async (server, { sendEmailService, contactsService }) => {
    const emailHandler = new EmailVerificationHandler(sendEmailService, contactsService);
    server.route(routes(emailHandler));
  },
};
