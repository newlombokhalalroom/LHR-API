const InvariantError = require('../../exceptions/InvariantError');
const { PostBankSchema, UUIDParamsSchema } = require('./schema');

const BanksValidator = {
  validatePostBankPayload: (payload) => {
    const validationResult = PostBankSchema.validate(payload);
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

module.exports = BanksValidator;
