const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class UserRolesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewRole(title) {
    const query = {
      text: 'SELECT id FROM roles WHERE title = $1',
      values: [title],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('User Role already exists');
    }
  }

  async addRole(title, description) {
    await this.verifyNewRole(title);
    const query = {
      text: 'INSERT INTO roles (title, description) VALUES ($1, $2) RETURNING id, title',
      values: [title, description],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Failed to add role');
    }

    return result.rows[0];
  }

  async getRoleId(title) {
    const query = {
      text: 'SELECT id FROM roles WHERE title = $1',
      values: [title],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Role not found');
    }
    return result.rows[0].id;
  }
}

module.exports = UserRolesService;
