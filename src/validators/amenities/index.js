const InvariantError = require('../../exceptions/InvariantError');
const {
  AmenitiesPayloadSchema,
  AmenitiesIdParamsSchema,
  UpdateAmenitiesPayloadSchema,
} = require('./schema');

const AmenitiesValidator = {
  validateAmenitiesPayload: (payload) => {
    const validationResult = AmenitiesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUpdateAmenitiesPayload: (payload) => {
    const validationResult = UpdateAmenitiesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAmenitiesIdParams: (params) => {
    const validationResult = AmenitiesIdParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AmenitiesValidator;
