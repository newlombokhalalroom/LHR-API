const Joi = require('joi');

const postOptionPayloadSchema = Joi.object({
  type: Joi.string().required(),
  category: Joi.string().max(100).required(),
  title: Joi.string().max(100).required(),
  price: Joi.number().required(),
});

const UUIDParamsSchema = Joi.object({
  id: Joi.string().guid({
    version: [
      'uuidv4',
    ],
  }),
});

module.exports = { postOptionPayloadSchema, UUIDParamsSchema };
