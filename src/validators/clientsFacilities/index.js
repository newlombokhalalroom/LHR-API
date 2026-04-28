const InvariantError = require('../../exceptions/InvariantError');
const { ClientsFacilitiesPayloadSchema, ClientsDeleteFacilitiesPayloadSchema } = require('./schema');

const ClientsFacilitiesValidator = {
  validateClientsFacilitiesPayload: (payload) => {
    const validationResult = ClientsFacilitiesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateClientsDeleteFacilitiesPayload: (payload) => {
    const validationResult = ClientsDeleteFacilitiesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ClientsFacilitiesValidator;
