const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const PolicyParamsSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
});

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

const PoliciesValidator = {
  validatePolicyParams: (params) => {
    const result = PolicyParamsSchema.validate(params);
    if (result.error) throw new InvariantError(result.error.message);
  },
  validatePoliciesPayload: (payload) => {
    const result = PoliciesPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },
  validateUpdatePoliciesPayload: (payload) => {
    const result = UpdatePoliciesPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },
};

module.exports = PoliciesValidator;
