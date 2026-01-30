const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class ClientsFacilitiesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addClientsFacilities(clientId, arrayOfFacilitiesId) {
    const queryValues = arrayOfFacilitiesId.map((facility) => [facility, clientId]);
    const query = {
      text: `
            INSERT INTO clients_facilities (facility_id, client_id)
            VALUES 
            ${queryValues.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ')} 
            ON CONFLICT (facility_id, client_id) DO NOTHING
            RETURNING facility_id`,
      values: queryValues.flat(),
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add client facilities');
    }

    return result.rows;
  }

  async getClientsFacilitiesByClientId(clientId) {
    const query = {
      text: 'SELECT * FROM clients_facilities cf LEFT JOIN facilities f ON cf.facility_id = f.id WHERE cf.client_id = $1',
      values: [clientId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async deleteClientsFacilities(clientId, facilityId) {
    const query = {
      text: 'DELETE FROM clients_facilities WHERE client_id = $1 AND facility_id = $2 RETURNING facility_id',
      values: [clientId, facilityId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete facility');
    }
  }
}

module.exports = ClientsFacilitiesService;
