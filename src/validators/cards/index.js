const InvariantError = require('../../exceptions/InvariantError');
const { PostCardSchema, PutCardSchema, UUIDParamsSchema } = require('./schema');

const CardsValidator = {
  validatePostCardPayload: (payload) => {
    const validationResult = PostCardSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutCardPayload: (payload) => {
    const validationResult = PutCardSchema.validate(payload);
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

module.exports = CardsValidator;
