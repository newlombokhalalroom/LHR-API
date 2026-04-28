const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class DestinationPicturesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async addDestinationPictures(destinationId, arrayOfPictures) {
    const queryValues = arrayOfPictures.map((picture) => [picture, destinationId]);
    const query = {
      text: `
            INSERT INTO destination_pictures (picture, destination_id)
            VALUES ${queryValues.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ')} 
            RETURNING *`,
      values: queryValues.flat(),
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add destination pictures');
    }

    return result.rows;
  }
}

module.exports = DestinationPicturesService;
