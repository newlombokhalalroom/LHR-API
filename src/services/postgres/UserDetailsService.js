const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class UserDetailsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addUserDetail(userId, {
    firstName, lastName, email, phone,
  }) {
    const query = {
      text: 'INSERT INTO user_details(user_id, first_name, last_name, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [userId, firstName, lastName, email, phone],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add user details');
    }

    return result.rows[0];
  }

  async getUserDetailsById(id) {
    const query = {
      text: 'SELECT * FROM user_details WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User details not found');
    }

    return result.rows[0];
  }
}

module.exports = UserDetailsService;
