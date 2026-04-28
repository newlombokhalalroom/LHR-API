const Joi = require('joi');

const FacilitesPayloadSchema = Joi.object({
  type: Joi.string().required(),
  title: Joi.string().max(100).required(),
  category: Joi.string().valid('halal', 'regular').required(),
});

module.exports = { FacilitesPayloadSchema };
