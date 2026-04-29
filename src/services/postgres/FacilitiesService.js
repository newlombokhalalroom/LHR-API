const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class FacilitiesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewFacility(title) {
    const query = {
      text: 'SELECT id FROM facilities WHERE title = $1',
      values: [title],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Facility already exists');
    }
  }

  async addFacility(type_id, { title, category }) {
    const query = {
      text: 'INSERT INTO facilities(type_id, title, category) VALUES ($1, $2, $3) RETURNING id',
      values: [type_id, title, category],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add facility');
    }
    return result.rows[0].id;
  }

  async getFacilityIdByTitle(arrayOfTitles) {
    const placeholders = arrayOfTitles.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT id FROM facilities WHERE title IN (${placeholders})`;
    const query = {
      text: queryText,
      values: arrayOfTitles,
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No facilities have been found');
    }

    return result.rows;
  }

  async getAllFacilities({ type, category }) {
    let queryText = 'SELECT f.id, t.title AS type, f.category, f.title FROM facilities f LEFT JOIN types t ON f.type_id = t.id';
    const queryParams = [];

    if (type) {
      queryText += ' WHERE t.title = $1';
      queryParams.push(type);
    }

    if (category) {
      if (queryParams.length > 0) {
        queryText += ' AND ';
      } else {
        queryText += ' WHERE ';
      }
      queryText += `f.category = $${queryParams.length + 1}`;
      queryParams.push(category);
    }

    queryText += ' ORDER BY f.title';

    const query = {
      text: queryText,
      values: queryParams,
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No facilities have been found');
    }
    return result.rows;
  }

  async getFacilityById(id) {
    const query = {
      text: `
        SELECT f.id, t.title AS type, f.category, f.title
        FROM facilities f
        LEFT JOIN types t ON f.type_id = t.id
        WHERE f.id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Facility not found');
    }

    return result.rows[0];
  }

  async updateFacilityById(id, payload, typeId) {
    const { title, category } = payload;

    const updates = [];
    const values = [];
    let index = 1;

    if (typeof typeId !== 'undefined' && typeId !== null) {
      updates.push(`type_id = $${index++}`);
      values.push(typeId);
    }

    if (typeof title !== 'undefined') {
      updates.push(`title = $${index++}`);
      values.push(title);
    }

    if (typeof category !== 'undefined') {
      updates.push(`category = $${index++}`);
      values.push(category);
    }

    // selalu update _updated_date
    updates.push('_updated_date = CURRENT_TIMESTAMP');

    const query = {
      text: `UPDATE facilities SET ${updates.join(', ')} WHERE id = $${index} RETURNING id`,
      values: [...values, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update facility. Id not found');
    }

    return result.rows[0].id;
  }

  async deleteFacilityById(id) {
    const query = {
      text: 'DELETE FROM facilities WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Facility not found');
    }
  }
}

module.exports = FacilitiesService;
