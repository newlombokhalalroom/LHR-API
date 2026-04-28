const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class PoliciesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewPolicy(title) {
    const query = {
      text: 'SELECT id FROM policies WHERE title = $1',
      values: [title],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Policy already exists');
    }
  }

  async addPolicy(typeId, { title, category, description }) {
    const query = {
      text: 'INSERT INTO policies(type_id, title, category, description) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [typeId, title, category, description],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add policy');
    }
    return result.rows[0];
  }

  async getPolicies(category, typeId) {
    const query = {
      text: 'SELECT * FROM policies WHERE 1=1',
      values: [],
    };
    if (category) {
      query.text += ' AND category = $1';
      query.values.push(category);
    }
    if (typeId) {
      query.text += ` AND type_id = $${query.values.length + 1}`;
      query.values.push(typeId);
    }
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No policies have been found');
    }
    return result.rows;
  }

  async getPolicyIdsByTitles(titles) {
    const placeholders = titles.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT id, title FROM policies WHERE title IN (${placeholders})`;
    const query = {
      text: queryText,
      values: titles,
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No titles have been found');
    }

    return result.rows;
  }
  async deletePolicy(id) {
    const query = {
      text: 'DELETE FROM policies WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete policy. Id not found');
    }
  }
  async updatePolicy(id, payload) {
    const fields = [];
    const values = [];
    let index = 1;

    if (payload.type_id) {
      fields.push(`type_id = $${index++}`);
      values.push(payload.type_id);
    }
    if (payload.title) {
      fields.push(`title = $${index++}`);
      values.push(payload.title);
    }
    if (payload.category) {
      fields.push(`category = $${index++}`);
      values.push(payload.category);
    }
    if (payload.description) {
      fields.push(`description = $${index++}`);
      values.push(payload.description);
    }

    if (fields.length === 0) {
      throw new Error('No data to update');
    }

    fields.push(`_updated_date = CURRENT_TIMESTAMP`);

    const query = {
      text: `UPDATE policies SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
      values: [...values, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Failed to update policy. Id not found');
    }

    return result.rows[0];
  }
}

module.exports = PoliciesService;
