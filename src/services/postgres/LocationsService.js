const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class LocationsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addLocations(clientId, {
    address,
    latitude,
    longitude,
    city,
    province,
  }) {
    const coordinate = `POINT(${longitude} ${latitude})`;
    const query = {
      text: 'INSERT INTO locations (client_id, address, coordinate, city, province) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (client_id) DO NOTHING RETURNING id',
      values: [clientId, address, coordinate, city, province],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add locations');
    }

    return result.rows[0].id;
  }

  async getLocationByClientId(clientId) {
    const query = {
      text: 'SELECT address, city, province, ST_X(coordinate::geometry) AS longitude, ST_Y(coordinate::geometry) AS latitude FROM locations WHERE client_id = $1',
      values: [clientId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }
    return result.rows[0];
  }

  async updateLocation(clientId, {
    address, city, province, longitude, latitude,
  }) {
    const coordinate = `POINT(${longitude} ${latitude})`;
    const query = {
      text: 'UPDATE locations SET address = $1, city = $2, province = $3, coordinate = $4 WHERE client_id = $5 RETURNING address, city, province, ST_X(coordinate::geometry) AS longitude, ST_Y(coordinate::geometry) AS latitude',
      values: [address, city, province, coordinate, clientId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update client\'s location');
    }

    return result.rows[0];
  }
}

module.exports = LocationsService;
