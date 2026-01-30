const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class ProductsAmenitiesService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async updateProductsAmenities(productId, arrayOfAmenitiesId) {
    if (arrayOfAmenitiesId?.length <= 0) {
      throw new InvariantError('Failed to update product amenities');
    }

    // todo: remove/add amenities while needed
    const catchExisting = (
      await this._pool.query({
        text: 'SELECT amenity_id FROM product_amenities WHERE product_id = $1',
        values: [productId],
      })
    )?.rows?.map((_item) => _item?.amenity_id);
    const newAmenities = arrayOfAmenitiesId.filter((_item) => !catchExisting?.includes(_item));
    const removedAmenities = catchExisting.filter((_item) => !arrayOfAmenitiesId?.includes(_item));

    if (newAmenities?.length > 0) {
      await this._pool.query({
        text: `INSERT INTO product_amenities (amenity_id, product_id) VALUES 
        ${newAmenities.map((_item) => `('${_item}', $1)`).toString()}`,
        values: [productId],
      });
    }

    if (removedAmenities?.length > 0) {
      await this._pool.query({
        text: `DELETE FROM product_amenities WHERE product_id = $1 AND amenity_id IN (${removedAmenities
          ?.map((_item) => `'${_item}'`)
          .toString()})`,
        values: [productId],
      });
    }

    return [
      ...(newAmenities || []),
      ...(catchExisting?.filter((_item) => !removedAmenities?.includes(_item)) || []),
    ];
  }

  async addProductsAmenities(productId, arrayOfAmenitiesId) {
    const queryValues = arrayOfAmenitiesId.map((amenity) => [amenity, productId]);
    const query = {
      text: `
            INSERT INTO product_amenities (amenity_id, product_id)
            VALUES 
            ${queryValues.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ')} 
            ON CONFLICT (amenity_id, product_id) DO NOTHING
            RETURNING (SELECT id FROM amenities WHERE id = amenity_id), (SELECT title FROM amenities WHERE id = amenity_id)`,
      values: queryValues.flat(),
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add product amenities');
    }

    return result.rows;
  }

  async getProductAmenitiesByProductId(productId) {
    const query = {
      text: 'SELECT a.id, a.title, a.category FROM product_amenities pa LEFT JOIN amenities a ON pa.amenity_id = a.id WHERE pa.product_id = $1',
      values: [productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async deleteProductsAmenities(productId, amenityId) {
    const query = {
      text: 'DELETE FROM product_amenities WHERE product_id = $1 AND amenity_id = $2 RETURNING (SELECT title AS product FROM products WHERE id = $1), (SELECT title AS amenity FROM amenities WHERE id = $2)',
      values: [productId, amenityId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete product amenities');
    }

    return result.rows;
  }
}

module.exports = ProductsAmenitiesService;
