const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination');

class WithdrawalsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyUserAccess(userId, withdrawalId) {
    const query = {
      text: 'SELECT w.id FROM withdrawals w LEFT JOIN cards c ON c.id = w.card_id WHERE w.id = $1 AND c.user_id = $2',
      values: [withdrawalId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Forbidden to access');
    }
  }

  async addWithdrawals(cardId, balanceId, amount) {
    const query = {
      text: `
      INSERT INTO withdrawals (card_id, balance_id, amount, status) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `,
      values: [cardId, balanceId, amount, 'pending'],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to withdrawal');
    }

    return result.rows[0];
  }

  async getWithdrawals(userId = null, status = null, params = null) {
    const pool = this._pool;
    const table = 'withdrawals';
    let query = `SELECT ${table}.* FROM ${table} LEFT JOIN cards ON cards.id = ${table}.card_id WHERE 1=1`;

    if (userId) {
      query += ` AND cards.user_id = '${userId}'`;
    }

    if (status) {
      query += ` AND ${table}.status = '${status}'`;
    }

    const filterWithPagination = await filterParamsIntoQuery(table, params, query);

    console.log(filterWithPagination.query);

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError(`${table} not found`);
    }

    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows,
    };
  }

  async getWithdrawalsById(id) {
    let query = {
      text: 'SELECT w.*, c.user_id FROM withdrawals w LEFT JOIN cards c ON c.id = w.card_id WHERE w.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return NotFoundError('No withdrawals found');
    }

    return result.rows[0];
  }

  async updateWithdrawalStatusAtomic(withdrawalId, nextStatus) {
    const allowed = new Set(['pending', 'cancelled', 'success']);
    if (!allowed.has(nextStatus)) throw new InvariantError('Invalid status');
    if (nextStatus === 'pending') throw new InvariantError('Invalid status transition');

    const client = await this._pool.connect();
    try {
      await client.query('BEGIN');

      // ✅ Ambil user_id lewat balances (karena withdrawals tidak punya user_id)
      const wRes = await client.query(
        `SELECT w.id,
              w.amount,
              w.status,
              w.balance_id,
              b.user_id
       FROM withdrawals w
       JOIN balances b ON b.id = w.balance_id
       WHERE w.id = $1
       FOR UPDATE`,
        [withdrawalId],
      );

      if (!wRes.rowCount) throw new InvariantError('Withdrawal not found');

      const w = wRes.rows[0];

      if (w.status !== 'pending') {
        throw new AuthorizationError('Forbidden to change status');
      }

      // ✅ Refund hanya saat cancelled
      if (nextStatus === 'cancelled') {
        const bRes = await client.query(
          `UPDATE balances
         SET amount = amount + $1,
             _updated_date = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id`,
          [w.amount, w.balance_id], // update by balance_id (lebih aman)
        );

        if (!bRes.rowCount) {
          throw new InvariantError('Balance not found for this user');
        }
      }

      const updRes = await client.query(
        `UPDATE withdrawals
       SET status = $1,
           _updated_date = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
        [nextStatus, withdrawalId],
      );

      await client.query('COMMIT');
      return updRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = WithdrawalsService;
