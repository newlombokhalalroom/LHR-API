const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class ProductItems {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addProductItem(productId, item) {
    const query = {
      text: 'INSERT INTO product_items (product_id, title) VALUES ($1, $2) RETURNING id, title',
      values: [productId, item],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add product item');
    }
    return result.rows[0];
  }

  async putProductItem(itemId, productId, title) {
    const updateAt = new Date();
    const query = {
      text: `UPDATE product_items SET title = $1, _updated_date = $2 
      WHERE id = $3 AND product_id = $4
      RETURNING id, title, _updated_date`,
      values: [title, updateAt, itemId, productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update product item');
    }
    return result.rows[0];
  }

  async deleteProductItem(itemId, productId) {
    const query = {
      text: 'DELETE FROM product_items WHERE id = $1 AND product_id = $2 RETURNING id, title',
      values: [itemId, productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete product item');
    }
    return result.rows[0];
  }

  async getProductItemsByProductId(productId, startDate, endDate) {
    let query;
    if (startDate && endDate) {
      query = {
        text: `SELECT id, title FROM product_items WHERE product_id = $1 AND id 
      NOT IN (
        SELECT item_id FROM unavailable_status WHERE
        (start_date <= $2 AND end_date >= $2) OR 
        (start_date <= $3 AND end_date >= $3) OR 
        (start_date >= $2 AND end_date <= $3)
      )`,
        values: [productId, startDate, endDate],
      };
    } else {
      query = {
        text: 'SELECT id, title FROM product_items WHERE product_id = $1',
        values: [productId],
      };
    }
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async getProductItemsByClientId(clientId, startDate, endDate) {
    let query;
    if (startDate && endDate) {
      query = {
        text: `SELECT id, product_id, title FROM product_items WHERE product_id IN (SELECT id FROM products WHERE client_id = $1) AND id 
      NOT IN (
        SELECT item_id FROM unavailable_status WHERE
        (start_date <= $2 AND end_date >= $2) OR 
        (start_date <= $3 AND end_date >= $3) OR 
        (start_date >= $2 AND end_date <= $3)
      )`,
        values: [clientId, startDate, endDate],
      };
    } else {
      query = {
        text: 'SELECT id, product_id, title FROM product_items WHERE product_id IN (SELECT id FROM products WHERE client_id = $1)',
        values: [clientId],
      };
    }
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async getProductItem(itemId, productId) {
    const query = {
      text: 'SELECT * FROM product_items WHERE id = $1 AND product_id = $2',
      values: [itemId, productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Item not found for the specified product.');
    }
    return result.rows[0];
  }
}

module.exports = ProductItems;
