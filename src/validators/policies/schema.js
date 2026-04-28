// validators/policies/schema.js
const Joi = require('joi');

const PoliciesPayloadSchema = Joi.object({
  type: Joi.string().required(),
  category: Joi.string().valid('halal', 'regular').required(),
  title: Joi.string().max(100).required(),
  description: Joi.string().required(),
});

const UpdatePoliciesPayloadSchema = Joi.object({
  type: Joi.string().optional(),
  category: Joi.string().valid('halal', 'regular').optional(),
  title: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
}).min(1);

module.exports = {
  PoliciesPayloadSchema,
  UpdatePoliciesPayloadSchema,
};
