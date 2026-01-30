// NEXT DEVELOPMENT

const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class ProductsOptionsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addProductOptions(productId, arrayOfObjectsOptions) {
    const queryValues = arrayOfObjectsOptions.map((option) => [option.id, option.price, productId]);
    const query = {
      text: `INSERT INTO products_options (option_id, price, product_id) 
        VALUES 
        ${queryValues.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')} 
        ON CONFLICT (product_id, option_id) DO NOTHING  
        RETURNING option_id, price`,
      values: queryValues.flat(),
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add product option');
    }

    return result.rows;
  }

  async updateProductOption(price, productId, optionId) {
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE products_options SET price = $1, _updated_date = $2 WHERE product_id = $3 AND option_id = $4 RETURNING (SELECT title AS product FROM products WHERE id = $3), (SELECT title AS option FROM options WHERE id = $4), price, _updated_date',
      values: [price, updatedAt, productId, optionId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update product option');
    }

    return result.rows;
  }

  async deleteProductsOptions(productId, optionId) {
    const query = {
      text: 'DELETE FROM products_options WHERE product_id = $1 AND option_id = $2 RETURNING (SELECT title AS product FROM products WHERE id = $1), (SELECT title AS option FROM options WHERE id = $2)',
      values: [productId, optionId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete product option');
    }

    return result.rows;
  }

  async getProductOptionsByProductId(productId) {
    const query = {
      text: 'SELECT o.id, o.title, po.price FROM products_options po LEFT JOIN options o ON po.option_id = o.id WHERE po.product_id = $1',
      values: [productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }
}

module.exports = ProductsOptionsService;
