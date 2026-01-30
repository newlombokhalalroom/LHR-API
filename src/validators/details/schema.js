const Joi = require('joi');

const DetailsPayloadSchema = Joi.object({
  category: Joi.string().max(100).required(),
  title: Joi.string().max(100).required(),
  type: Joi.string().required(),
});

const UpdateDetailPayloadSchema = Joi.object({
  category: Joi.string().max(100).optional(),
  title: Joi.string().max(100).optional(),
  type: Joi.string().optional(),
}).min(1);

const DetailCategoriesPayloadSchema = Joi.object({
  title: Joi.string().max(100).required(),
});

const UpdateDetailCategoriesPayloadSchema = Joi.object({
  title: Joi.string().max(100).optional(),
}).min(1);

const DetailCategoriesParamsSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
});

module.exports = {
  DetailsPayloadSchema,
  UpdateDetailPayloadSchema,
  DetailCategoriesPayloadSchema,
  UpdateDetailCategoriesPayloadSchema,
  DetailCategoriesParamsSchema,
  UpdateDetailPayloadSchema,
};
