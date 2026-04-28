const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class OrderItemsService {
  constructor(productsService) {
    this._pool = createDatabasePool();
    this._productsService = productsService;
  }

  async addOrderItems(orderId, orderItems) {
    const queryValues = orderItems.map((item) => [item.orderProductDetailsId, item.quantity, item.total, orderId]);

    const query = {
      text: `
            INSERT INTO order_items (order_product_details_id, quantity, total, order_id)
            VALUES
            ${queryValues.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ')} 
            RETURNING *`,
      values: queryValues.flat(),
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add order items');
    }

    return result.rows;
  }

  async addOrderItems_(orderId, orderItems) {
    const result = await Promise.all(
      orderItems.map(async (items) => {
        const addedOrderItems = await this._pool.query({
          text: `INSERT INTO order_items (order_product_details_id, quantity, total, order_id)
            VALUES($1, $2, $3, $4) RETURNING *`,
          values: [items.orderProductDetailsId, items.quantity, items.total, orderId],
        });

        const addedOptions = await Promise.all(items.options.map(async (option) => {
          const addedOption = await this._pool.query({
            text: `INSERT INTO order_options_items(option_id, title, category, price, order_items_id)
              VALUES($1, $2, $3, $4, $5) RETURNING *`,
            values: [option.id, option.title, option.category, option.price, addedOrderItems.rows[0].id],
          });
          return addedOption.rows[0];
        }));

        return {
          ...addedOrderItems.rows[0],
          addedOptions,
        };
      }),
    );

    return result;
  }

  async getOrderItems(orderId) {
    const query = {
      text: 'SELECT oi.*, opd.product_id FROM order_items oi LEFT JOIN order_product_details opd ON opd.id = oi.order_product_details_id  WHERE oi.order_id = $1',
      values: [orderId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to get order items');
    }
    return result.rows;
  }

  async getInvoiceItems(id) {
    const query = {
      text: 'SELECT oi.*, opd.product_id, opd.title, opd.description, opd.price, opd.units, opd._created_date FROM order_items oi LEFT JOIN order_product_details opd ON opd.id = oi.order_product_details_id  WHERE oi.order_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No invoice items found');
    }
    const _result = await Promise.all(
      result.rows.map(async (orderItem) => {
        const optionsQuery = {
          text: 'SELECT * FROM order_options_items WHERE order_items_id = $1',
          values: [orderItem.id],
        };
        const optionsResult = await this._pool.query(optionsQuery);

        const options = optionsResult.rows;

        return {
          ...orderItem,
          options,
        };
      }),
    );

    return _result;
  }

  // probably not needed
  async calculateOrderItemPrice(items, days) {
    const arrayOfProductId = items.map((obj) => obj.product_id);

    const newItems = await this._productsService.getProductPricesById(arrayOfProductId);

    const _newItems = items.map((product) => {
      const match = newItems.find((item) => product.product_id === item.id);
      return {
        ...product,
        price: match ? match.price : 0,
        total_price: match ? match.price * product.quantity * days : 0,
      };
    });
    return _newItems;
  }
}

module.exports = OrderItemsService;
