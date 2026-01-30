const InvariantError = require('../../exceptions/InvariantError');
const { UserRolesPayloadSchema } = require('./schema');

const UserRolesValidator = {
  validateUserRolesPayload: (payload) => {
    const validationResult = UserRolesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UserRolesValidator;
