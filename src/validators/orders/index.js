const InvariantError = require('../../exceptions/InvariantError');
const {
  OrdersPayloadSchema,
  UUIDParamsSchema,
  ConfimationStatusParams,
  GetOrdersQuery,
  PostReviewParamsSchema,
  PostReviewPayloadSchema,
  UpdateOrderPayloadSchema,
} = require('./schema');

const OrdersValidator = {
  validateOrdersPayload: (payload) => {
    const validationResult = OrdersPayloadSchema.validate(payload);
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

  validateConfimationStatusParams: (params) => {
    const validationResult = ConfimationStatusParams.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateGetOrdersQuery: (query) => {
    const validationResult = GetOrdersQuery.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostReviewParams: (params) => {
    const validationResult = PostReviewParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostReviewPayload: (payload) => {
    const validationResult = PostReviewPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUpdateOrderPayload: (payload) => {
    const result = UpdateOrderPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = OrdersValidator;
