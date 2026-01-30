const Joi = require('joi');

const PostWithdrawalSchema = Joi.object({
  amount: Joi.number().min(100000).required(),
});

const UUIDParamsSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .required(),
});

const PutWithdrawalStatusPayloadSchema = Joi.object({
  status: Joi.string().valid('cancelled', 'success').required(),
});

module.exports = {
  PostWithdrawalSchema,
  PutWithdrawalStatusPayloadSchema,
  UUIDParamsSchema,
};
