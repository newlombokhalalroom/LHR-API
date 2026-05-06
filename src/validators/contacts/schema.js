const Joi = require('joi');

const ContactPayloadSchema = Joi.object({
  firstName: Joi.string().max(100).pattern(/^[A-Za-z\s]+$/).allow('')
    .required(),
  lastName: Joi.string().max(100).pattern(/^[A-Za-z\s]*$/).allow('')
    .required(),
  email: Joi.string().email({ tlds: true }).max(100).allow('')
    .required(),
  phone: Joi.string().max(50).pattern(/^[0-9+]+$/).allow('')
    .required(),
});

module.exports = { ContactPayloadSchema };
