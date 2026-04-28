const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class ProductsPoliciesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyClientAccess(productId, clientId) {
    const query = {
      text: 'SELECT id FROM products WHERE id = $1 AND client_id = $2',
      values: [productId, clientId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Forbidden to access');
    }
  }

  async addProductPolicies(productId, policies) {
    const queryValues = policies.map((policy) => [policy.id, productId, policy.details]);
    const query = {
      text: `INSERT INTO products_policies (policy_id, product_id, details) 
        VALUES 
        ${queryValues.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')} 
        ON CONFLICT (policy_id, product_id) DO NOTHING  
        RETURNING *`,
      values: queryValues.flat(),
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add product\'s policies');
    }
    return result.rows;
  }

  async getProductPoliciesByProductId(productId) {
    const query = {
      text: 'SELECT pp.policy_id, p.title, p.category, p.description, pp.details FROM products_policies pp LEFT JOIN policies p ON pp.policy_id = p.id WHERE pp.product_id = $1',
      values: [productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async updateProductPolicy(productId, policyId, details) {
    const updatedAt = new Date();
    const query = {
      text: `UPDATE products_policies 
        SET details = $1, _updated_date = $2 
        WHERE policy_id = $3 AND product_id = $4 
        RETURNING policy_id, details, _updated_date`,
      values: [details, updatedAt, policyId, productId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update product\'s policies');
    }
    return result.rows[0];
  }

  async deleteProductPolicy(productId, policyId) {
    const query = {
      text: `DELETE FROM products_policies 
        WHERE policy_id = $1 AND product_id = $2
        RETURNING *`,
      values: [policyId, productId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete product\'s policies');
    }
    return result.rows[0];
  }
}

module.exports = ProductsPoliciesService;
