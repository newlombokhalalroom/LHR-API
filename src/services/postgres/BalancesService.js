const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class BalancesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async getBalanceByUserId(userId) {
    const query = {
      text: 'SELECT * FROM balances WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balance not found');
    }
    return result.rows[0];
  }

  async addDefaultBalanceByUserId(userId) {
    const query = {
      text: 'INSERT INTO balances (user_id, amount) VALUES ($1, $2)',
      values: [userId, 0],
    };
    await this._pool.query(query);
  }

  async updateUserBalance(newAmount, userId) {
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE balances set amount = $1, _updated_date = $2 WHERE user_id = $3 RETURNING *',
      values: [newAmount, updatedAt, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update user balance');
    }

    return result.rows[0];
  }

  async increaseUserBalance(amount, userId) {
    const currentBalance = await this.getBalanceByUserId(userId);
    const updatedBalance = parseFloat(currentBalance.amount) + parseFloat(amount);
    const balance = await this.updateUserBalance(updatedBalance, userId);

    return balance;
  }

  async decreaseUserBalance(amount, userId) {
    const currentBalance = await this.getBalanceByUserId(userId);
    const updatedBalance = parseFloat(currentBalance.amount) - amount; // need to validate not a minus value
    const balance = await this.updateUserBalance(updatedBalance, userId);

    return balance;
  }
  async getTotalLiabilityExcludeMe(currentUserId) {
    const q = await this._pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_liability,
            COUNT(*)::int AS total_accounts
     FROM balances
     WHERE user_id <> $1`,
      [currentUserId],
    );

    return {
      total_liability: Number(q.rows[0].total_liability || 0),
      total_accounts: Number(q.rows[0].total_accounts || 0),
    };
  }
}

module.exports = BalancesService;
