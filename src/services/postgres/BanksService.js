const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class BanksService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewBankCode(code) {
    const query = {
      text: 'SELECT id FROM banks WHERE code = $1',
      values: [code],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError(`Bank with code ${code} already exists`);
    }
  }

  async addBank(code, title, icon) {
    const query = {
      text: 'INSERT INTO banks(code, title, icon) VALUES($1, $2, $3) RETURNING *',
      values: [code, title, icon],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to insert bank');
    }
    return result.rows[0];
  }

  async getBankById(id) {
    const query = {
      text: 'SELECT * FROM banks WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(`Bank with id ${id} was not found`);
    }
    return result.rows[0];
  }

  async updateBank(id, code, title, icon) {
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE banks SET code = $1, title = $2, icon = $3, _updated_date = $4 WHERE id = $5 RETURNING *',
      values: [code, title, icon, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update bank');
    }
    return result.rows[0];
  }

  async getBanks() {
    const query = {
      text: 'SELECT * FROM banks ORDER BY code',
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No bank was found');
    }
    return result.rows;
  }
}

module.exports = BanksService;
