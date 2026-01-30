const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');

class ClientDetailsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addClientDetails(clientId, {
    name, email, phone, npwp,
  }) {
    const query = {
      text: 'INSERT INTO client_details (client_id, name, email, phone, npwp) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [clientId, name, email, phone, npwp],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add client details');
    }

    return result.rows[0];
  }

  async getClientDetailsById(id) {
    const query = {
      text: 'SELECT * FROM client_details WHERE id=$1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Client details not found');
    }

    return result.rows[0];
  }
}

module.exports = ClientDetailsService;
