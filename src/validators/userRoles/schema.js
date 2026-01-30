const Joi = require('joi');

const UserRolesPayloadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = { UserRolesPayloadSchema };
