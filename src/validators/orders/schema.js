const Joi = require('joi');

const OrderItemSchema = Joi.object({
  productId: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

const OrdersPayloadSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  orderItems: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().guid({ version: 'uuidv4' }).required(),
        optionId: Joi.array()
          .items(Joi.string().guid({ version: 'uuidv4' }))
          .optional(),
        quantity: Joi.number().min(1).optional(),
        schedule_id: Joi.string().guid({ version: 'uuidv4' }).optional(),
        hotel_id: Joi.string().guid({ version: 'uuidv4' }).optional(),
        pickup_location: Joi.string().allow('', null).optional(),
      }).unknown(true)
    )
    .required(),
}).unknown(true);

const PostReviewParamsSchema = Joi.object({
  orderId: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .required(),
  productId: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .required(),
});

const PostReviewPayloadSchema = Joi.object({
  reviewContent: Joi.string().required().min(1).max(1000),
  reviewRate: Joi.number().required().min(1).max(5),
});

const UUIDParamsSchema = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

const ConfimationStatusParams = Joi.object({
  status: Joi.string().valid('progress', 'cancelled').required(),
});

const GetOrdersQuery = Joi.object({
  filter: Joi.string().optional(),
  limit: Joi.number().optional(),
  page: Joi.number().optional(),
});
const UpdateOrderPayloadSchema = Joi.object({
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
  total: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid('unpaid', 'process', 'progress', 'done', 'cancelled').optional(),
}).min(1);

module.exports = {
  OrderItemSchema,
  OrdersPayloadSchema,
  UUIDParamsSchema,
  ConfimationStatusParams,
  GetOrdersQuery,
  PostReviewParamsSchema,
  PostReviewPayloadSchema,
  UpdateOrderPayloadSchema,
};
