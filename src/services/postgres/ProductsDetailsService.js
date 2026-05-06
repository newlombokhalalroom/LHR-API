const InvariantError = require('../../exceptions/InvariantError');
const { createDatabasePool } = require('../../utils/config');

class ProductsDetailsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async updateProductDetail(productId, arrayOfObjectsDetails) {
    if (arrayOfObjectsDetails?.length <= 0) {
      throw new InvariantError('Failed to update product detail');
    }

    // todo: remove/add detail while needed
    const catchExisting = (
      await this._pool.query({
        text: 'SELECT detail_id FROM product_details WHERE product_id = $1',
        values: [productId],
      })
    )?.rows?.map((_item) => _item?.detail_id);
    const newDetails = arrayOfObjectsDetails.filter((_item) => !catchExisting?.includes(_item.id));
    const removedDetails = catchExisting.filter(
      (_item) => !arrayOfObjectsDetails?.find((__item) => __item.id === _item),
    );

    if (newDetails?.length > 0) {
      await this._pool.query({
        text: `INSERT INTO product_details (product_id, detail_id, amount) VALUES 
        ${newDetails.map((_item) => `($1, '${_item.id}', ${_item.amount})`).toString()}`,
        values: [productId],
      });
    }

    if (removedDetails?.length > 0) {
      await this._pool.query({
        text: `DELETE FROM product_details WHERE product_id = $1 AND detail_id IN (${removedDetails
          ?.map((_item) => `'${_item}'`)
          .toString()})`,
        values: [productId],
      });
    }

    return [
      ...(newDetails || []),
      ...(catchExisting?.filter((_item) => !removedDetails?.includes(_item)) || []),
    ];
  }

  async addProductDetail(productId, arrayOfObjectsDetails) {
    const queryValues = arrayOfObjectsDetails.map((detail) => [
      detail.id,
      detail.amount,
      productId,
    ]);
    const query = {
      text: `INSERT INTO product_details (detail_id, amount, product_id) 
        VALUES 
        ${queryValues
    .map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`)
    .join(', ')} 
        ON CONFLICT (product_id, detail_id) DO NOTHING  
        RETURNING detail_id, amount`,
      values: queryValues.flat(),
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add product detail');
    }

    return result.rows;
  }

  async getProductDetailsByProductId(productId) {
    const query = {
      text: 'SELECT d.id, d.title, pd.amount FROM product_details pd LEFT JOIN details d ON pd.detail_id = d.id WHERE pd.product_id = $1',
      values: [productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async deleteProductsDetails(productId, detailId) {
    const query = {
      text: 'DELETE FROM product_details WHERE product_id = $1 AND detail_id = $2 RETURNING (SELECT title AS product FROM products WHERE id = $1), (SELECT title AS detail FROM details WHERE id = $2)',
      values: [productId, detailId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete product detail');
    }

    return result.rows;
  }

  async updateProductsDetails(amount, productId, detailId) {
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE product_details SET amount = $1, _updated_date = $2 WHERE product_id = $3 AND detail_id = $4 RETURNING (SELECT title AS product FROM products WHERE id = $3), (SELECT title AS detail FROM details WHERE id = $4), amount, _updated_date',
      values: [amount, updatedAt, productId, detailId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update product detail');
    }

    return result.rows;
  }
}

module.exports = ProductsDetailsService;
