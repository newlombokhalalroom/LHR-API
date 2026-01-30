const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination');

class AdvertisementsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewAdvertisement({ title, type }) {
    const query = {
      text: 'SELECT id FROM advertisements WHERE title = $1 AND type = $2',
      values: [title, type],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Advertisement already exists');
    }
  }

  async addAdvertisement({
    title,
    description,
    image,
    type,
    status,
    start_date,
    end_date,
    link_target,
    priority,
  }) {
    const query = {
      text: `
        INSERT INTO advertisements 
        (title, description, image, type, status, start_date, end_date, link_target, priority) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
      `,
      values: [
        title,
        description,
        image,
        type,
        status,
        start_date,
        end_date,
        link_target,
        priority,
      ],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getAllAdvertisements(type, status, params = null) {
    const table = 'advertisements';

    // Susun WHERE clause dinamis
    const whereClauses = [];
    if (type) whereClauses.push(`type = '${type}'`);
    if (status) whereClauses.push(`status = '${status}'`);

    let baseQuery = `SELECT * FROM ${table}`;
    if (whereClauses.length > 0) {
      baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    baseQuery += ' ORDER BY created_at DESC';

    // Gunakan util filter untuk pagination
    const filtered = await filterParamsIntoQuery(table, params, baseQuery);

    // Jika tidak ada data
    if (!filtered.result.rowCount) {
      throw new NotFoundError('Advertisements not found');
    }

    // Kembalikan format yang seragam
    return {
      total: filtered.total,
      count: filtered.count,
      pages: filtered.pages,
      result: filtered.result.rows,
    };
  }

  async getAdvertisementById(id) {
    const query = {
      text: 'SELECT * FROM advertisements WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Advertisement not found');
    }
    return result.rows[0];
  }

  async updateAdvertisementById(id, payload) {
    const updated_at = new Date();

    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const key in payload) {
      if (payload[key] !== undefined) {
        fields.push(`${key} = $${paramIndex++}`);
        values.push(payload[key]);
      }
    }

    fields.push(`updated_at = $${paramIndex++}`);
    values.push(updated_at);

    values.push(id);

    const query = {
      text: `
      UPDATE advertisements SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `,
      values,
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update advertisement');
    }
    return result.rows[0];
  }

  async deleteAdvertisementById(id) {
    const query = {
      text: 'DELETE FROM advertisements WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete advertisement');
    }
    return result.rows[0];
  }
}

module.exports = AdvertisementsService;
