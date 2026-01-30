const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class OrderProductDetailsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addOrderProductDetail(arrayProductsObject) {
    const queryValues = arrayProductsObject.map((item) => [item.id, item.title, item.description, item.price, item.units]);
    const query = {
      text: `
            INSERT INTO order_product_details (product_id, title, description, price, units)
            VALUES
            ${queryValues.map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(', ')}
            RETURNING *`,
      values: queryValues.flat(),
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add order items');
    }

    return result.rows;
  }

  async getOrderProductDetailsById(arrayOfId) {
    const placeholders = arrayOfId.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT * FROM order_product_details WHERE id IN (${placeholders})`;
    const query = {
      text: queryText,
      values: arrayOfId,
    };

    const result = await this._pool.query(query);

    if (!result.rows) {
      throw new NotFoundError('Order product details not found');
    }

    return result.rows;
  }
}

module.exports = OrderProductDetailsService;
