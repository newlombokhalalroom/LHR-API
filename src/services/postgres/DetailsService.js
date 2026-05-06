const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class DetailsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewDetail(title) {
    const query = {
      text: 'SELECT id FROM details WHERE title = $1',
      values: [title],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError(`${title} already exists`);
    }
  }

  async addDetail(categoryId, title, type_id) {
    const query = {
      text: 'INSERT INTO details(category_id, title, type_id) VALUES($1, $2, $3) RETURNING id, (SELECT title FROM detail_categories WHERE id = $1) AS category, title, (SELECT title FROM types WHERE id = $3) AS type',
      values: [categoryId, title, type_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add detail');
    }

    return result.rows[0];
  }

  async getDetailIdByTitle(arrayOfTitles) {
    const placeholders = arrayOfTitles.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT id, title FROM details WHERE title IN (${placeholders})`;
    const query = {
      text: queryText,
      values: arrayOfTitles,
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No details have been found');
    }

    return result.rows;
  }

  async getDetails(categoryId, typeId) {
    const query = {
      text: 'SELECT * FROM details WHERE 1=1',
      values: [],
    };
    if (categoryId) {
      query.text += ' AND category_id = $1';
      query.values.push(categoryId);
    }
    if (typeId) {
      query.text += ` AND type_id = $${query.values.length + 1}`;
      query.values.push(typeId);
    }
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No details have been found');
    }
    return result.rows;
  }

  async updateDetailById(id, { title, category_id, type_id }) {
    const fields = [];
    const values = [];
    let index = 1;

    if (category_id) {
      fields.push(`category_id = $${index++}`);
      values.push(category_id);
    }
    if (title) {
      fields.push(`title = $${index++}`);
      values.push(title);
    }
    if (type_id) {
      fields.push(`type_id = $${index++}`);
      values.push(type_id);
    }

    if (fields.length === 0) {
      throw new InvariantError('No valid fields to update');
    }

    fields.push('_updated_date = CURRENT_TIMESTAMP');

    const query = {
      text: `UPDATE details SET ${fields.join(
        ', ',
      )} WHERE id = $${index} RETURNING id, title, category_id, type_id, _updated_date`,
      values: [...values, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update detail');
    }

    return result.rows[0];
  }

  async deleteDetailById(id) {
    const query = {
      text: 'DELETE FROM details WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Detail not found');
    }

    return result.rows[0].id;
  }

  async getAllDetails() {
    const query = {
      text: `
        SELECT 
          d.id,
          d.title,
          d._created_date,
          d._updated_date,
          d.category_id,
          dc.title AS category_title,
          d.type_id,
          t.title AS type_title
        FROM details d
        LEFT JOIN detail_categories dc ON d.category_id = dc.id
        LEFT JOIN types t ON d.type_id = t.id
        ORDER BY d._created_date DESC
      `,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = DetailsService;
