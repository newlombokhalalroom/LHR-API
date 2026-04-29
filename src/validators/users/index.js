const InvariantError = require('../../exceptions/InvariantError');
const {
  UserPayloadSchema,
  UserParamsSchema,
  UserResetPasswordSchema,
  UserChangePasswordSchema,
  UserPictureUrlSchema,
  UserQuerySchema,
  UserUpdatePayloadSchema,
  UserCreatePayloadSchema,
  RoleParamsSchema,
} = require('./schema');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateUserParams: (params) => {
    const validationResult = UserParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateUserResetPasswordPayload: (payload) => {
    const validationResult = UserResetPasswordSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateUserChangePasswordPayload: (payload) => {
    const validationResult = UserChangePasswordSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateUserPictureUrl: (payload) => {
    const validationResult = UserPictureUrlSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateUserParams: (params) => {
    const validationResult = UserParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateUserQuery: (query) => {
    const { error } = UserQuerySchema.validate(query);
    if (error) throw new InvariantError(error.message);
  },
  validateUserUpdatePayload: (payload) => {
    const { error } = UserUpdatePayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validateUserCreatePayload: (payload) => {
    const { error } = UserCreatePayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },

  validateRoleParam: (params) => {
    const { error } = RoleParamsSchema.validate(params);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = UsersValidator;
