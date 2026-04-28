const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class ClientPicturesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addClientPictures(clientId, { url, title, description }) {
    const query = {
      text: 'INSERT INTO client_pictures (client_id, picture, title, description) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [clientId, url, title, description],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add client picture');
    }
    return result.rows[0].id;
  }

  async getClientPicturesByClientId(clientId) {
    const query = {
      text: 'SELECT id, picture, title, description FROM client_pictures WHERE client_id = $1',
      values: [clientId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async deleteClientPicturesById(id, clientId) {
    const query = {
      text: 'DELETE FROM client_pictures WHERE id = $1 AND client_id = $2 RETURNING title',
      values: [id, clientId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete picture');
    }

    return result.rows[0].title;
  }
}

module.exports = ClientPicturesService;
