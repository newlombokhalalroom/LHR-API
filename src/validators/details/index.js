const InvariantError = require('../../exceptions/InvariantError');
const {
  DetailsPayloadSchema,
  UpdateDetailPayloadSchema,
  DetailCategoriesPayloadSchema,
  UpdateDetailCategoriesPayloadSchema,
  DetailCategoriesParamsSchema,
} = require('./schema');

const DetailCategoriesValidator = {
  validatePostDetailsPayload: (payload) => {
    const result = DetailsPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },

  validateUpdateDetailPayload: (payload) => {
    const result = UpdateDetailPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },

  validateDetailCategoriesPayload: (payload) => {
    const result = DetailCategoriesPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },

  validateUpdateDetailCategoriesPayload: (payload) => {
    const result = UpdateDetailCategoriesPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },

  validateDetailCategoriesParams: (params) => {
    const result = DetailCategoriesParamsSchema.validate(params);
    if (result.error) throw new InvariantError(result.error.message);
  },
  validateUpdateDetailPayload: (payload) => {
    const result = UpdateDetailPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },
};

module.exports = DetailCategoriesValidator;
