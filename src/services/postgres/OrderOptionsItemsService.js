const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class OrderOptionsItemsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async getOrderOptionsItemsByOrderId(orderId) {
    const query = {
      text: 'SELECT * FROM order_options_items ooi LEFT JOIN order_items oi ON ooi.order_items_id = oi.id WHERE oi.order_id = $1',
      values: [orderId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows;
  }

  async getOrderOptionsItemsByOrderItemsId(orderItemsId) {
    const query = {
      text: 'SELECT * FROM order_options_items WHERE order_items_id = $1',
      values: [orderItemsId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows;
  }
}

module.exports = OrderOptionsItemsService;
