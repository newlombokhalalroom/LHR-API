const Joi = require('joi');

const ClientPayloadSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .optional(),
  type: Joi.string().optional(),
  name: Joi.string().max(100).optional(),
  email: Joi.string().email({ tlds: true }).optional(),
  phone: Joi.string().max(50).optional(),
  npwp: Joi.string().max(100).optional(),
  picture: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .default(null),
  description: Joi.string().optional(),
});

const ClientParamsSchema = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

const ClientPicturesSchema = Joi.object({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
});

const ClientDeletePicturesSchema = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

const ClientLocationSchema = Joi.object({
  address: Joi.string().max(100).required(),
  latitude: Joi.number().min(-90).max(90).required()
    .strict(true),
  longitude: Joi.number().min(-180).max(180).required()
    .strict(true),
  city: Joi.string().max(100).required(),
  province: Joi.string().max(100).required(),
});

const ClientPolicySchema = Joi.object({
  title: Joi.string().required(),
  details: Joi.string().required(),
});

const ClientPoliciesSchema = Joi.object({
  policies: Joi.array().items(ClientPolicySchema).min(1).required(),
});

const UUIDParamsSchema = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

const UpdatePolicySchema = Joi.object({
  details: Joi.string().required(),
});
// update
const getAllClientsQuery = Joi.object({
  filter: Joi.string().optional(),
  limit: Joi.number().optional(),
  page: Joi.number().optional(),
});

module.exports = {
  ClientPayloadSchema,
  ClientParamsSchema,
  ClientPicturesSchema,
  ClientLocationSchema,
  ClientDeletePicturesSchema,
  ClientPoliciesSchema,
  UUIDParamsSchema,
  UpdatePolicySchema,
  getAllClientsQuery,
};
