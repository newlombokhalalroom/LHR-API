// src/services/postgres/CardsService.js
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination'); // ← tambahkan ini

class CardsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewCard(userId) {
    const query = {
      text: 'SELECT id FROM cards WHERE user_id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('User already have a card');
    }
  }

  async addCard(userId, { bankId, cardNumber, cardHolder }) {
    const query = {
      text: 'INSERT INTO cards (bank_id, user_id, card_number, card_holder) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [bankId, userId, cardNumber, cardHolder],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add card');
    }

    return result.rows[0];
  }

  async getCard(userId) {
    const query = {
      text: 'SELECT * FROM cards WHERE user_id = $1 ORDER BY _created_date DESC LIMIT 1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Card information has not been found');
    }

    const bank = await this._pool.query({
      text: 'SELECT id, icon, code, title FROM banks WHERE id = $1',
      values: [result.rows[0].bank_id],
    });

    return {
      ...result.rows[0],
      bank: bank?.rows[0] || null,
    };
  }

  async updateCard(userId, { bankId, cardNumber, cardHolder }) {
    const updateAt = new Date();
    const query = {
      text: 'UPDATE cards set bank_id = $1, card_number = $2, card_holder = $3, _updated_date = $4 WHERE user_id = $5 RETURNING *',
      values: [bankId, cardNumber, cardHolder, updateAt, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update card');
    }

    return result.rows[0];
  }

  async getCardById(id) {
    const query = {
      text: `
        SELECT
          c.id,
          c.bank_id,
          c.user_id,
          c.card_number,
          c.card_holder,
          c._created_date,
          c._updated_date,

          b.code  AS bank_code,
          b.title AS bank_title,
          b.icon  AS bank_icon,

          u.username  AS user_username,
          u.role_id   AS user_role_id,
          r.title     AS user_role_title

        FROM cards c
        LEFT JOIN banks b ON b.id = c.bank_id
        LEFT JOIN users u ON u.id = c.user_id
        LEFT JOIN roles r ON r.id = u.role_id
        WHERE c.id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Card information has not been found');
    }

    const row = result.rows[0];

    return {
      id: row.id,
      bank_id: row.bank_id,
      user_id: row.user_id,
      card_number: row.card_number,
      card_holder: row.card_holder,
      _created_date: row._created_date,
      _updated_date: row._updated_date,

      bank: {
        id: row.bank_id,
        code: row.bank_code,
        title: row.bank_title,
        icon: row.bank_icon,
      },

      user: {
        id: row.user_id,
        username: row.user_username || null,
        role_id: row.user_role_id || null,
        role_title: row.user_role_title || null,
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async getAllCards(params = null) {
    const table = 'cards';

    let query = `
      SELECT
        c.id,
        c.bank_id,
        c.user_id,
        c.card_number,
        c.card_holder,
        c._created_date,
        c._updated_date,

        b.code  AS bank_code,
        b.title AS bank_title,
        b.icon  AS bank_icon,

        u.username  AS user_username,
        u.role_id   AS user_role_id,
        r.title     AS user_role_title
      FROM cards c
      LEFT JOIN banks b ON b.id = c.bank_id
      LEFT JOIN users u ON u.id = c.user_id
      LEFT JOIN roles r ON r.id = u.role_id
      WHERE 1=1
    `;

    const filterWithPagination = await filterParamsIntoQuery(table, params, query);

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError(`${table} not found`);
    }

    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows.map((row) => ({
        id: row.id,
        bank_id: row.bank_id,
        user_id: row.user_id,
        card_number: row.card_number,
        card_holder: row.card_holder,
        _created_date: row._created_date,
        _updated_date: row._updated_date,
        bank: {
          id: row.bank_id,
          code: row.bank_code,
          title: row.bank_title,
          icon: row.bank_icon,
        },
        user: {
          id: row.user_id,
          username: row.user_username || null,
          role_id: row.user_role_id || null,
          role_title: row.user_role_title || null,
        },
      })),
    };
  }
}

module.exports = CardsService;
