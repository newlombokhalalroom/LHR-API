const Joi = require('joi');

const ClientTypesPayloadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = { ClientTypesPayloadSchema };
