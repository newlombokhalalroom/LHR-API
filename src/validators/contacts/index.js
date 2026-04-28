const InvariantError = require('../../exceptions/InvariantError');
const { ContactPayloadSchema } = require('./schema');

const ContactsValidator = {
  validateContactPayload: (payload) => {
    const validationResult = ContactPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ContactsValidator;
