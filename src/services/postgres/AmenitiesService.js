const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination');

class AmenitiesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewAmenity({ title, category }) {
    const query = {
      text: 'SELECT id FROM amenities WHERE title = $1 AND category = $2',
      values: [title, category],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Amenities already exists');
    }
  }

  async addAmenity(typeId, { category, title }) {
    const query = {
      text: 'INSERT INTO amenities (type_id, title, category) VALUES ($1, $2, $3) RETURNING id, type_id, title, category, _created_date',
      values: [typeId, title, category],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add amenities');
    }
    return result.rows[0];
  }

  async getAllAmenities(type, category, params = null) {
    const table = 'amenities';
    let query = `SELECT ${table}.id, types.title AS type, ${table}.category, ${table}.title FROM ${table} LEFT JOIN types ON ${table}.type_id = types.id`;
    const queryParams = [];

    if (type) {
      query += ` WHERE LOWER(types.title) = LOWER('${type}')`;
      // queryParams.push(type);
    }

    if (category) {
      if (type) {
        query += ' AND ';
      } else {
        query += ' WHERE ';
      }
      query += `${table}.category = '${category}'`; // $2
      // queryParams.push(category);
    }

    // const query = {
    //   text: query,
    //   values: queryParams,
    // };

    const filterWithPagination = await filterParamsIntoQuery(table, params, query);

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

  async getAmenityIdByIds(arrayOfIds) {
    const placeholders = arrayOfIds.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT id FROM amenities WHERE id IN (${placeholders})`;
    const query = {
      text: queryText,
      values: arrayOfIds,
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No amenities have been found');
    }

    return result.rows;
  }

  async getAmenityById(id) {
    const query = {
      text: 'SELECT t.title AS type, a.category, a.title FROM amenities a LEFT JOIN types t ON a.type_id = t.id WHERE a.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No amenity has been found');
    }
    return result.rows[0];
  }

  async updateAmenityById(id, typeId = null, payload) {
    const fields = [];
    const values = [];
    let index = 1;

    if (typeId) {
      fields.push(`type_id = $${index++}`);
      values.push(typeId);
    }
    if ('category' in payload) {
      fields.push(`category = $${index++}`);
      values.push(payload.category);
    }
    if ('title' in payload) {
      fields.push(`title = $${index++}`);
      values.push(payload.title);
    }

    if (fields.length === 0) {
      throw new InvariantError('No field to update');
    }

    fields.push(`_updated_date = CURRENT_TIMESTAMP`);
    const query = {
      text: `UPDATE amenities SET ${fields.join(
        ', ',
      )} WHERE id = $${index} RETURNING id, type_id, category, title, _updated_date`,
      values: [...values, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update amenity');
    }

    return result.rows[0];
  }

  async deleteAmenityById(id) {
    const query = {
      text: 'DELETE FROM amenities WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete amenity');
    }
    return result.rows[0];
  }
}

module.exports = AmenitiesService;
