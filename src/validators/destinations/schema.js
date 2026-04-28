const Joi = require('joi');

const PostDestinationSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().required(),
  category: Joi.string().max(100).required(),
  address: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  city: Joi.string().max(100).required(),
  province: Joi.string().max(100).required(),
  pictures: Joi.array().items(
    Joi.string().uri({ scheme: ['http', 'https'] }),
  ).min(1).required(),
});

const UUIDParamsSchema = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

const getDestinationsQuerySchema = Joi.object({
  category: Joi.string().optional(),
  city: Joi.string().optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
});

module.exports = {
  PostDestinationSchema,
  UUIDParamsSchema,
  getDestinationsQuerySchema,
};
