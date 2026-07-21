const Joi = require('joi');

const PartnerHotelPayloadSchema = Joi.object({
  name: Joi.string().required(),
  price_per_night: Joi.number().integer().min(0).required(),
  address: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
}).unknown(true);

module.exports = { PartnerHotelPayloadSchema };
