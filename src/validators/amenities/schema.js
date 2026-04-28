const Joi = require('joi');

const AmenitiesPayloadSchema = Joi.object({
  type: Joi.string().required(),
  title: Joi.string().max(100).required(),
  category: Joi.string().valid('halal', 'regular', 'excluded').required(),
});

const UpdateAmenitiesPayloadSchema = Joi.object({
  type: Joi.string().optional(),
  title: Joi.string().max(100).optional(),
  category: Joi.string().valid('halal', 'regular', 'excluded').optional(),
}).min(1);
const AmenitiesIdParamsSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
});

module.exports = {
  AmenitiesPayloadSchema,
  UpdateAmenitiesPayloadSchema,
  AmenitiesIdParamsSchema,
};
