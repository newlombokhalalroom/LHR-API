const InvariantError = require('../../exceptions/InvariantError');
const {
  ProductsPayloadSchema,
  UpdateProductsPayloadSchema,
  UUIDParamsSchema,
  ProductAmenitiesSchema,
  ProductPicturesPayloadSchema,
  ProductDetailsPayloadSchema,
  postProductItemPayloadSchema,
  productItemAsUnavailableSchema,
  ProductDetailUpdateSchema,
  PostProductOptionsPayloadSchema,
  PutProductOptionSchema,
  getCarsQuerySchema,
  ProductPoliciesSchema,
  UpdatePolicySchema,
  GetReviewsQuerySchema,
} = require('./schema');

const ProductsValidator = {
  validateProductsPayload: (payload) => {
    const validationResult = ProductsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateProductsAmenitiesPayload: (payload) => {
    const validationResult = ProductAmenitiesSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateProductsPicturesPayload: (payload) => {
    const validationResult = ProductPicturesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateProductsDetailsPayload: (payload) => {
    const validationResult = ProductDetailsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateGetClientProductsParams: (params) => {
    const validationResult = UUIDParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateGetProductByIdParams: (params) => {
    const validationResult = UUIDParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutProductsPayload: (params) => {
    const validationResult = UpdateProductsPayloadSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutProductsParams: (params) => {
    const validationResult = UUIDParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteProductAmenitiesParams: (params) => {
    const validationResult = UUIDParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteProductPicturesParams: (params) => {
    const validationResult = UUIDParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteProductDetailsParams: (params) => {
    const validationResult = UUIDParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateProductItemPayload: (payload) => {
    const validationResult = postProductItemPayloadSchema.validate(payload);
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

  validateProductItemAsUnavailablePayload: (payload) => {
    const validationResult = productItemAsUnavailableSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateProductDetailUpdatePayload: (payload) => {
    const validationResult = ProductDetailUpdateSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostProductOptionsPayload: (payload) => {
    const validationResult = PostProductOptionsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutProductOptionPayload: (payload) => {
    const validationResult = PutProductOptionSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateGetCarsQuery: (query) => {
    const validationResult = getCarsQuerySchema.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateProductPolicies: (payload) => {
    const validationResult = ProductPoliciesSchema.validate(payload);
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

  validateGetReviewsQuery: (query) => {
    const validationResult = GetReviewsQuerySchema.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ProductsValidator;
