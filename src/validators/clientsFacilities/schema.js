const Joi = require('joi');

const ClientsFacilitiesPayloadSchema = Joi.object({
  facilities: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),
});

const ClientsDeleteFacilitiesPayloadSchema = Joi.object({
  facility: Joi.string().required(),
});

module.exports = { ClientsFacilitiesPayloadSchema, ClientsDeleteFacilitiesPayloadSchema };
