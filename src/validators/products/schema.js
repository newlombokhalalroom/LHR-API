const Joi = require('joi');

const ProductDetailsSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .optional(),
  title: Joi.string().required(),
  amount: Joi.number().required(),
});

const ProductDetailUpdateSchema = Joi.object({
  amount: Joi.number().required(),
});

const ProductPicturesSchema = Joi.object({
  picture: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
});

const ProductPicturesPayloadSchema = Joi.object({
  pictures: Joi.array().items(ProductPicturesSchema).required(),
});

const ProductDetailsPayloadSchema = Joi.object({
  details: Joi.array().items(ProductDetailsSchema).required(),
});

const ProductAmenitiesSchema = Joi.object({
  amenities: Joi.array().items(
    Joi.string().guid({ version: ['uuidv4'] }),
  ).min(1).required(),
});

const ProductsPayloadSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .optional(), // optional
  title: Joi.string().required(),
  description: Joi.string().required(),
  availability: Joi.boolean().required(),
  price: Joi.number().required(),
  units: Joi.string().required(),
  amenities: Joi.array().items(Joi.object({ id: Joi.string().guid({ version: ['uuidv4'] }) }).unknown(true)).min(1).required(),
  pictures: Joi.array().items(ProductPicturesSchema).required(),
  details: Joi.array().items(ProductDetailsSchema).required(),
});

const UpdateProductsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  availability: Joi.boolean().required(),
  price: Joi.number().required(),
  units: Joi.string().required(),
});

const UUIDParamsSchema = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

const postProductItemPayloadSchema = Joi.object({
  title: Joi.string().required(),
});

const productItemAsUnavailableSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
});

const ProductOptionsSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
});

const PostProductOptionsPayloadSchema = Joi.object({
  options: Joi.array().items(ProductOptionsSchema).required(),
});

const PutProductOptionSchema = Joi.object({
  price: Joi.number().required(),
});

const getCarsQuerySchema = Joi.object({
  amenity: Joi.string(),
  city: Joi.string(),
  startDate: Joi.alternatives().conditional('endDate', {
    is: Joi.exist(),
    then: Joi.date().iso().required(),
    otherwise: Joi.date().iso(),
  }),
  endDate: Joi.alternatives().conditional('startDate', {
    is: Joi.exist(),
    then: Joi.date().iso().greater(Joi.ref('startDate')).required(),
    otherwise: Joi.date().iso(),
  }),
  detailTitle: Joi.string(),
  detailAmount: Joi.number(),
});

const ProductPolicySchema = Joi.object({
  title: Joi.string().required(),
  details: Joi.string().required(),
});

const ProductPoliciesSchema = Joi.object({
  policies: Joi.array().items(ProductPolicySchema).min(1).required(),
});

const UpdatePolicySchema = Joi.object({
  details: Joi.string().required(),
});

const GetReviewsQuerySchema = Joi.object({
  sort: Joi.string().valid('highest_rating', 'lowest_rating').optional(),
  filter: Joi.number().integer().min(1).max(5)
    .optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100)
    .optional(),
});

module.exports = {
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
};
