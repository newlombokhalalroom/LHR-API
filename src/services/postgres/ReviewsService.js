const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class ReviewsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyUserAccess(order_id, user_id) {
    const query = {
      text: 'SELECT * FROM orders o LEFT JOIN user_details ud ON o.user_details_id = ud.id WHERE o.id = $1 AND ud.user_id = $2',
      values: [order_id, user_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Forbidden to access this resources');
    }
  }

  async checkExistingReviewForProductInOrder(order_id, product_id) {
    const query = {
      text: 'SELECT * FROM reviews WHERE order_id = $1 AND product_id = $2',
      values: [order_id, product_id],
    };
    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('A review for this product related to this order already exists.');
    }
  }

  async postReview(order_id, user_id, product_id, review_content, review_rate) {
    const query = {
      text: 'INSERT INTO reviews (order_id, user_id, product_id, review_content, review_rate) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [order_id, user_id, product_id, review_content, review_rate],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add review');
    }

    return result.rows[0];
  }

  async getReviewsByProductId(product_id, sort, filter, page, limit) {
    let orderBy = '';
    let whereClause = '';
    const offset = (page - 1) * limit;

    // Set orderBy based on sort option
    if (sort === 'highest_rating') {
      orderBy = 'ORDER BY review_rate DESC';
    } else if (sort === 'lowest_rating') {
      orderBy = 'ORDER BY review_rate ASC';
    } else {
      orderBy = 'ORDER BY _created_date DESC'; // Default to newest reviews
    }

    // Set whereClause based on filter option
    if (filter && (filter >= 1 && filter <= 5)) {
      whereClause = `AND review_rate = ${filter}`;
    }

    const query = {
      text: `SELECT * FROM reviews WHERE product_id = $1 ${whereClause} ${orderBy} LIMIT $2 OFFSET $3`,
      values: [product_id, limit, offset],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No reviews has been found');
    }

    return result.rows;
  }
}

module.exports = ReviewsService;
