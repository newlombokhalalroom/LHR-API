const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination');

class DestinationsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addDestination({
    title,
    description,
    category,
    address,
    latitude,
    longitude,
    city,
    province,
  }) {
    const coordinate = `POINT(${longitude} ${latitude})`;
    const query = {
      text: 'INSERT INTO destinations(title, description, category, address, coordinate, city, province) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      values: [title, description, category, address, coordinate, city, province],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to insert destination');
    }
    return result.rows[0];
  }

  async getDestinationById(id) {
    const query = {
      text: 'SELECT *, ST_X(coordinate::geometry) AS longitude, ST_Y(coordinate::geometry) AS latitude FROM destinations WHERE id = $1',
      values: [id],
    };
    const destinations = await this._pool.query(query);
    if (!destinations.rowCount) {
      throw new NotFoundError('Destination not found');
    }
    query.text = 'SELECT * FROM destination_pictures WHERE destination_id = $1';
    const pictures = await this._pool.query(query);
    return {
      ...destinations.rows[0],
      pictures: pictures?.rows || [],
    };
  }

  async getDestinations({ category, city, latitude, longitude }) {
    let queryText = `
      SELECT 
        destinations.*, 
        ST_X(coordinate::geometry) AS longitude, 
        ST_Y(coordinate::geometry) AS latitude,
        dp.picture
      FROM 
        destinations 
        LEFT JOIN (
          SELECT 
            destination_id, 
            picture, 
            ROW_NUMBER() OVER (PARTITION BY destination_id ORDER BY _created_date ASC) AS row_num
          FROM 
            destination_pictures
        ) dp ON destinations.id = dp.destination_id AND dp.row_num = 1
      WHERE 
        1 = 1
    `;

    const values = [];

    if (category) {
      queryText += ` AND category = $${values.length + 1}`;
      values.push(category);
    }

    if (city) {
      queryText += ` AND city = $${values.length + 1}`;
      values.push(city);
    }

    if (latitude && longitude) {
      const distance = 10000; // distance in meters
      queryText += ` AND ST_DWithin(coordinate, ST_MakePoint($${values.length + 1}, $${
        values.length + 2
      }), $${values.length + 3})`;
      values.push(parseFloat(longitude), parseFloat(latitude), parseFloat(distance));
    }

    const query = {
      text: queryText,
      values,
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Destination not found');
    }
    return result.rows;
  }

  async getCategories() {
    const query = {
      text: 'SELECT DISTINCT category FROM destinations',
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Categories not found');
    }
    const categories = result.rows.map((row) => row.category);
    return categories;
  }
  async getAllDestinations(params = null) {
    const table = 'destinations';

    // Base query: select with coordinates
    let baseQuery = `
    SELECT 
      id, title, description, category, address,
      ST_X(coordinate::geometry) AS longitude,
      ST_Y(coordinate::geometry) AS latitude,
      city, province,
      _created_date, _updated_date
    FROM ${table}
    WHERE 1 = 1
  `;

    const filters = [];

    if (params?.city) {
      filters.push(`city = '${params.city}'`);
    }

    if (params?.category) {
      filters.push(`category = '${params.category}'`);
    }

    if (filters.length > 0) {
      baseQuery += ' AND ' + filters.join(' AND ');
    }

    baseQuery += ' ORDER BY _created_date DESC';

    // Gunakan helper pagination
    const filtered = await filterParamsIntoQuery(table, params, baseQuery);

    if (!filtered.result.rowCount) {
      throw new NotFoundError('No destinations found');
    }

    return {
      total: filtered.total,
      count: filtered.count,
      pages: filtered.pages,
      result: filtered.result.rows,
    };
  }
  async updateDestination(id, payload) {
    // Ambil data lama
    const queryOld = {
      text: 'SELECT * FROM destinations WHERE id = $1',
      values: [id],
    };
    const oldResult = await this._pool.query(queryOld);

    if (!oldResult.rowCount) {
      throw new NotFoundError('Destination not found');
    }

    const oldData = oldResult.rows[0];

    // Gunakan data lama jika field kosong/null
    const title = payload.title ?? oldData.title;
    const description = payload.description ?? oldData.description;
    const category = payload.category ?? oldData.category;
    const address = payload.address ?? oldData.address;
    const city = payload.city ?? oldData.city;
    const province = payload.province ?? oldData.province;

    const latitude = payload.latitude ?? oldData.coordinate.y;
    const longitude = payload.longitude ?? oldData.coordinate.x;

    const coordinate = `POINT(${longitude} ${latitude})`;

    const updated_at = new Date();

    const query = {
      text: `
      UPDATE destinations SET
        title = $1,
        description = $2,
        category = $3,
        address = $4,
        coordinate = $5,
        city = $6,
        province = $7,
        _updated_date = $8
      WHERE id = $9
      RETURNING 
        id, title, description, category, address, 
        ST_X(coordinate::geometry) AS longitude,
        ST_Y(coordinate::geometry) AS latitude,
        city, province, _created_date, _updated_date
    `,
      values: [title, description, category, address, coordinate, city, province, updated_at, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update destination');
    }
    return result.rows[0];
  }
  async deleteDestination(id) {
    const query = {
      text: 'DELETE FROM destinations WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete destination. ID not found');
    }
  }
}

module.exports = DestinationsService;
