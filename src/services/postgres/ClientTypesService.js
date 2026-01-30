const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class ClientTypesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async verifyNewClientType(title) {
    const query = {
      text: 'SELECT id FROM types WHERE title = $1',
      values: [title],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Client type already exists');
    }
  }

  async addClientType(title, description) {
    await this.verifyNewClientType(title);
    const query = {
      text: 'INSERT INTO types (title, description) VALUES ($1, $2) RETURNING id, title',
      values: [title, description],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Failed to add client type');
    }

    return result.rows[0];
  }

  async getClientTypeId(title) {
    const query = {
      text: 'SELECT id FROM types WHERE title = $1',
      values: [title],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Client type not found');
    }
    return result.rows[0].id;
  }

  async getAllClientType(title = null) {
    let query = {
      text: 'SELECT * FROM types',
    };

    if (title) {
      query.text += ' WHERE title = $1';
      query.values = [title];
    }

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('client type not found');
    }
    return result.rows;
  }

  async getTypeTitleById(id) {
    const query = {
      text: 'SELECT title FROM types WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Client title not found');
    }
    return result.rows[0].title;
  }
  async updateClientType(id, { title, description }) {
    // Ambil data lama
    const existing = await this._pool.query({
      text: 'SELECT * FROM types WHERE id = $1',
      values: [id],
    });

    if (!existing.rowCount) {
      throw new NotFoundError('Client type not found');
    }

    const old = existing.rows[0];

    const newTitle = title ?? old.title;
    const newDescription = description ?? old.description;
    const updatedAt = new Date();

    const result = await this._pool.query({
      text: `
      UPDATE types
      SET title = $1, description = $2, _updated_date = $3
      WHERE id = $4
      RETURNING id, title, description, _created_date, _updated_date
    `,
      values: [newTitle, newDescription, updatedAt, id],
    });

    if (!result.rowCount) {
      throw new InvariantError('Failed to update client type');
    }

    return result.rows[0];
  }
  async deleteClientType(id) {
    const query = {
      text: 'DELETE FROM types WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete client type. ID not found');
    }
  }
}

module.exports = ClientTypesService;
