const InvariantError = require('../../exceptions/InvariantError');
const { ClientTypesPayloadSchema } = require('./schema');

const ClientTypesValidator = {
  validateClientTypesPayload: (payload) => {
    const validationResult = ClientTypesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ClientTypesValidator;
