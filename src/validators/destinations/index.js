const InvariantError = require('../../exceptions/InvariantError');
const { PostDestinationSchema, UUIDParamsSchema, getDestinationsQuerySchema } = require('./schema');

const DestinationsValidator = {
  validatePostDestinationPayload: (payload) => {
    const validationResult = PostDestinationSchema.validate(payload);
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
  validateGetDestinationsQuery: (query) => {
    const validationResult = getDestinationsQuerySchema.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = DestinationsValidator;
