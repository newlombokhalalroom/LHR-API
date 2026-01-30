const InvariantError = require('../../exceptions/InvariantError');
const {
  PostWithdrawalSchema,
  PutWithdrawalStatusPayloadSchema,
  UUIDParamsSchema,
} = require('./schema');

const WithdrawalsValidator = {
  validatePostWithdrawalPayload: (payload) => {
    const validationResult = PostWithdrawalSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },

  validatePutWithdrawalStatusPayload: (payload) => {
    const validationResult = PutWithdrawalStatusPayloadSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },

  validateUUIDParams: (params) => {
    const validationResult = UUIDParamsSchema.validate(params);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

module.exports = WithdrawalsValidator;
