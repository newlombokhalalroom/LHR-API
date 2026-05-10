const { Pool } = require('pg');
const uuid = require('uuid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { createDatabasePool } = require('../../utils/config');

class PartnerHotelsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addPartnerHotel({ name, price_per_night, address, description, clientId }) {
    const id = uuid.v4();
    const query = {
      text: 'INSERT INTO partner_hotels (id, client_id, name, price_per_night, address, description) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, clientId, name, price_per_night, address, description],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add partner hotel');
    }

    return result.rows[0].id;
  }

  async getPartnerHotelsByClientId(clientId) {
    const query = {
      text: 'SELECT id, name, price_per_night, address, description FROM partner_hotels WHERE client_id = $1 ORDER BY name',
      values: [clientId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPartnerHotelById(id) {
    const query = {
      text: 'SELECT id, name, price_per_night, address, description, client_id FROM partner_hotels WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Partner hotel not found');
    }

    return result.rows[0];
  }

  async updatePartnerHotelById(id, { name, price_per_night, address, description }) {
    const query = {
      text: 'UPDATE partner_hotels SET name = $1, price_per_night = $2, address = $3, description = $4 WHERE id = $5 RETURNING id',
      values: [name, price_per_night, address, description, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update partner hotel. Id not found');
    }
  }

  async deletePartnerHotelById(id) {
    const query = {
      text: 'DELETE FROM partner_hotels WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Partner hotel failed to delete. Id not found');
    }
  }

  async verifyPartnerHotelOwner(id, clientId) {
    const hotel = await this.getPartnerHotelById(id);
    if (hotel.client_id !== clientId) {
      throw new AuthorizationError('You do not have permission to access this resource');
    }
  }
}

module.exports = PartnerHotelsService;
