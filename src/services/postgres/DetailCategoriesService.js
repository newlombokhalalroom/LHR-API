const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class DetailCategoriesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewDetailCategories(title) {
    const query = {
      text: 'SELECT id FROM detail_categories WHERE title = $1',
      values: [title],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError(`${title} category is already exists`);
    }
  }

  async addDetailCategories(title) {
    const query = {
      text: 'INSERT INTO detail_categories(title) VALUES ($1)RETURNING id',
      values: [title],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add detail category');
    }

    return result.rows[0].id;
  }

  async getDetailCategories() {
    const query = {
      text: 'SELECT * FROM detail_categories',
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No detail categories has been found');
    }

    return result.rows;
  }

  async getDetailCategoriesIdByTitle(title) {
    const query = {
      text: 'SELECT id FROM detail_categories WHERE title = $1',
      values: [title],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(`There is no ${title} in detail categories`);
    }

    return result.rows[0].id;
  }

  async getDetailCategoriesTitleById(id) {
    const query = {
      text: 'SELECT title FROM detail_categories WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No detail category has been found');
    }

    return result.rows[0].title;
  }

  async updateDetailCategory(id, { title }) {
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE detail_categories SET title = $1, _updated_date = $2 WHERE id = $3 RETURNING id, title',
      values: [title, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update detail category');
    }
    return result.rows[0];
  }

  async deleteDetailCategory(id) {
    const query = {
      text: 'DELETE FROM detail_categories WHERE id = $1 RETURNING id, title',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete detail category');
    }
  }

  async getAllDetailCategories() {
    const result = await this._pool.query(`
      SELECT id, title, _created_date, _updated_date
      FROM detail_categories
      ORDER BY _created_date DESC
    `);
    return result.rows;
  }
}

module.exports = DetailCategoriesService;
