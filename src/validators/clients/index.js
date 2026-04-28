const InvariantError = require('../../exceptions/InvariantError');
const {
  ClientPayloadSchema, ClientParamsSchema, ClientPicturesSchema, ClientLocationSchema, ClientDeletePicturesSchema, ClientPoliciesSchema, UUIDParamsSchema, UpdatePolicySchema, getAllClientsQuery,
} = require('./schema');

const ClientValidator = {
  validateClientPayload: (payload) => {
    const validationResult = ClientPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateClientParams: (payload) => {
    const validationResult = ClientParamsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateClientPictures: (payload) => {
    const validationResult = ClientPicturesSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateClientDeletePictures: (payload) => {
    const validationResult = ClientDeletePicturesSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateClientLocation: (payload) => {
    const validationResult = ClientLocationSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateClientPolicies: (payload) => {
    const validationResult = ClientPoliciesSchema.validate(payload);
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
  validateUpdatePolicyPayload: (payload) => {
    const validationResult = UpdatePolicySchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateGetAllClientsQuery: (query) => {
    const validationResult = getAllClientsQuery.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ClientValidator;
