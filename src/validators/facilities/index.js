const InvariantError = require('../../exceptions/InvariantError');
const { FacilitesPayloadSchema } = require('./schema');

const FacilitiesValidator = {
  validateFacilitiesPayload: (payload) => {
    const validationResult = FacilitesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = FacilitiesValidator;
