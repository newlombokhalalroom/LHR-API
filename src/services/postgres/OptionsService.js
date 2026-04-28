const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class OptionsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewOption(title, category) {
    const query = {
      text: 'SELECT id FROM options WHERE title = $1 AND category = $2',
      values: [title, category],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError(`Option with title ${title} already exists`);
    }
  }

  async verifyOrderOption(arrayOfIds) {
    const placeholders = arrayOfIds.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT * FROM options WHERE id IN (${placeholders})`;
    const query = {
      text: queryText,
      values: [...arrayOfIds],
    };

    const result = await this._pool.query(query);
    if (result.rowCount < arrayOfIds.length) {
      throw new InvariantError('Invalid options id');
    }

    return result.rows;
  }

  async addOption(typeId, { category, title, price }) {
    const query = {
      text: 'INSERT INTO options (type_id, category, title, price) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [typeId, category, title, price],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add option for some reason');
    }
    return result.rows[0];
  }

  async getOptionById(id) {
    const query = {
      text: 'SELECT o.*, t.title AS type FROM options o LEFT JOIN types t ON o.type_id = t.id WHERE o.id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No option has been found');
    }
    return result.rows[0];
  }

  async updateOptionById(id, typeId, { title, category, price }) {
    const updateAt = new Date();
    const query = {
      text: `UPDATE options SET 
      type_id = $1, 
      category = $2, 
      title = $3, 
      price = $4,
      _updated_date = $5 
      WHERE id = $6
      RETURNING *`,
      values: [typeId, category, title, price, updateAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update option');
    }

    return result.rows[0];
  }

  async deleteOptionById(id) {
    const query = {
      text: 'DELETE FROM options WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete option');
    }
  }

  async getOptions(category = null, typeId = null) {
    let query = {
      text: 'SELECT o.*, t.title AS type_title FROM options o LEFT JOIN types t ON t.id = o.type_id WHERE 1=1',
    };

    if (category) {
      query.text += ` AND o.category = '${category}'`;
    }

    if (typeId) {
      query.text += ` AND o.type_id = '${typeId}'`;
    }

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No option has been found');
    }

    return result.rows;
  }

  async getOptionIdByTitle(arrayOfTitles) {
    const placeholders = arrayOfTitles.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT id, title, price FROM options WHERE title IN (${placeholders})`;
    const query = {
      text: queryText,
      values: arrayOfTitles,
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No options have been found');
    }

    return result.rows;
  }

  async getOptionPrices(arrayOfIds) {
    const placeholders = arrayOfIds.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT SUM(price) AS additional_price
    FROM options
    WHERE id IN (${placeholders});`;
    const query = {
      text: queryText,
      values: arrayOfIds,
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }

    return result.rows[0];
  }
}

module.exports = OptionsService;
