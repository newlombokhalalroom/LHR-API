const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class ProductPictures {
  constructor() {
    this._pool = createDatabasePool();
  }

  async updateProductPictures(productId, arrayOfObjectsPictures) {
    if (arrayOfObjectsPictures?.length <= 0) {
      throw new InvariantError('Failed to update product pictures');
    }

    // todo: remove/add pictures while needed
    const catchExisting = (
      await this._pool.query({
        text: 'SELECT picture FROM product_pictures WHERE product_id = $1',
        values: [productId],
      })
    )?.rows?.map((_item) => _item?.picture);

    const newPictures = arrayOfObjectsPictures.filter(
      (_item) => !catchExisting?.includes(_item.picture),
    );
    const removedPictures = catchExisting.filter(
      (_item) => !arrayOfObjectsPictures?.find((__item) => __item.picture === _item),
    );

    console.log(newPictures, removedPictures);

    if (newPictures?.length > 0) {
      await this._pool.query({
        text: `INSERT INTO product_pictures (product_id, picture, title, description) VALUES 
        ${newPictures
    .map(
      (_item) => `($1, '${_item.picture}', '${_item.title}', '${_item.description || '-'}')`,
    )
    .toString()}`,
        values: [productId],
      });
    }

    if (removedPictures?.length > 0) {
      await this._pool.query({
        text: `DELETE FROM product_pictures WHERE product_id = $1 AND picture IN (${removedPictures
          ?.map((_item) => `'${_item}'`)
          .toString()})`,
        values: [productId],
      });
    }

    return [
      ...(newPictures?.map((_item) => _item?.picture) || []),
      ...(catchExisting?.filter((_item) => !removedPictures?.includes(_item)) || []),
    ];
  }

  async addProductPictures(productId, arrayOfObjectsPictures) {
    const queryValues = arrayOfObjectsPictures.map((pic) => [
      pic.picture,
      pic.title,
      pic.description,
      productId,
    ]);
    const query = {
      text: `
              INSERT INTO product_pictures (picture, title, description, product_id)
              VALUES 
              ${queryValues
    .map(
      (_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`,
    )
    .join(', ')} 
              RETURNING id, picture, description, title`,
      values: queryValues.flat(),
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add product pictures');
    }

    return result.rows;
  }

  async getProductPicturesByProductId(productId) {
    const query = {
      text: 'SELECT id, picture, title, description FROM product_pictures WHERE product_id = $1',
      values: [productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async deleteProductPictures(pictureId) {
    const query = {
      text: 'DELETE FROM product_pictures WHERE id = $1 RETURNING id, picture, title, description',
      values: [pictureId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete product pictures');
    }

    return result.rows[0];
  }
}

module.exports = ProductPictures;
