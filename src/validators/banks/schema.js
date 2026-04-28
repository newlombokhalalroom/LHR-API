const Joi = require('joi');

const PostBankSchema = Joi.object({
  code: Joi.string().max(50).required(),
  title: Joi.string().max(100).required(),
  icon: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .default(null),
});

const UUIDParamsSchema = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

module.exports = {
  PostBankSchema,
  UUIDParamsSchema,
};
