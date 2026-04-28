const InvariantError = require('../../exceptions/InvariantError');
const { postOptionPayloadSchema, UUIDParamsSchema } = require('./schema');

const OptionsValidator = {
  validatePostOptionPayload: (payload) => {
    const validationResult = postOptionPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUUIDParams: (params) => {
    const validationResult = UUIDParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = OptionsValidator;
