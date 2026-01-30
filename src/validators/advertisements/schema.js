const Joi = require('joi');

const AdvertisementPayloadSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(null, ''),
  image: Joi.string().uri().allow(null, ''),
  type: Joi.string().max(50).required(),
  status: Joi.string().valid('active', 'inactive').required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  link_target: Joi.string().uri().allow(null, ''),
  priority: Joi.number().integer().min(0).default(0),
});

const UpdateAdvertisementPayloadSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  description: Joi.string().allow(null, '').optional(),
  image: Joi.string().uri().allow(null, '').optional(),
  type: Joi.string().max(50).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  link_target: Joi.string().uri().allow(null, '').optional(),
  priority: Joi.number().integer().min(0).optional(),
}).min(1); // ✅ wajib ada minimal 1 field untuk update

module.exports = {
  AdvertisementPayloadSchema,
  UpdateAdvertisementPayloadSchema,
};
