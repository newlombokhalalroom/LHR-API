const ContactsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'contacts',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const contactsHandler = new ContactsHandler(service, validator);
    server.route(routes(contactsHandler));
  },
};
