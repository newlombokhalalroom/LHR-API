const Joi = require('joi');

const PostCardSchema = Joi.object({
  bankId: Joi.string().guid({
    version: ['uuidv4'],
  }).required(),
  cardNumber: Joi.string().max(16).required(),
  cardHolder: Joi.string().max(100).required(),
});

const PutCardSchema = Joi.object({
  bankId: Joi.string().guid({
    version: ['uuidv4'],
  }).required(),
  cardNumber: Joi.string().max(16).required(),
  cardHolder: Joi.string().max(100).required(),
});

const UUIDParamsSchema = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

module.exports = {
  PostCardSchema,
  PutCardSchema,
  UUIDParamsSchema,
};
