const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .optional(),
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      'string.pattern.base': 'Username must only contain letters, numbers, and underscores.',
    })
    .required(),
  picture: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .allow(null)
    .optional(),
  email: Joi.string().email({ tlds: true }).required(),
  password: Joi.string().min(8).required(),
});

const UserUpdatePayloadSchema = Joi.object({
  username: Joi.string().optional(),
  picture: Joi.string().uri().optional(),
  first_name: Joi.string().allow(null, '').optional(),
  last_name: Joi.string().allow(null, '').optional(),
  email: Joi.string().email().allow(null, '').optional(),
  phone: Joi.string().allow(null, '').optional(),
  _is_email_verified: Joi.boolean().optional(),
  _is_phone_verified: Joi.boolean().optional(),
  role_id: Joi.string().guid({ version: 'uuidv4' }).optional(),
  role_title: Joi.string().valid('user', 'admin', 'super-admin').optional(),
});

const UserParamsSchema = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

const UserPictureUrlSchema = Joi.object({
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
});

const UserResetPasswordSchema = Joi.object({
  code: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

const UserChangePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

const UserQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100)
    .default(10),
  filter: Joi.string().optional().description('JSON string filter'),
});

const RoleParamsSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required(),
});

const UserCreatePayloadSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  picture: Joi.string().allow(null, '').optional(),

  email: Joi.string().email().required(),
  phone: Joi.string().allow(null, '').optional(),
  first_name: Joi.string().allow(null, '').optional(),
  last_name: Joi.string().allow(null, '').optional(),
});

module.exports = {
  UserPayloadSchema,
  UserParamsSchema,
  UserChangePasswordSchema,
  UserPictureUrlSchema,
  UserResetPasswordSchema,
  UserQuerySchema,
  UserUpdatePayloadSchema,
  UserCreatePayloadSchema,
  RoleParamsSchema,
};
