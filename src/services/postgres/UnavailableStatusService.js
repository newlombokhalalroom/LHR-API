const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination');

class UnavailableStatusService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async getUnavailableItems(params, clientId) {
    const table = 'unavailable_status';

    const filterWithPagination = await filterParamsIntoQuery(
      table,
      params,
      `SELECT ${table}.*, product_items.title, products.id as product_id FROM ${table} LEFT JOIN product_items ON product_items.id = ${table}.item_id LEFT JOIN products ON products.id = product_items.product_id ${
        clientId ? `WHERE products.client_id = '${clientId}'` : ''
      }`,
    );

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError('orders not found');
    }

    filterWithPagination.result.rows = await Promise.all(
      filterWithPagination.result.rows?.map(async (_product_item_status) => {
        const _product_item = await this._pool.query({
          text: 'SELECT * FROM product_items WHERE id = $1 LIMIT 1',
          values: [_product_item_status.item_id],
        });

        if (_product_item?.rows?.[0]?.product_id) {
          const _product = await this._pool.query({
            text: 'SELECT * FROM products WHERE id = $1 LIMIT 1',
            values: [_product_item?.rows?.[0]?.product_id],
          });

          _product_item_status.product = _product?.rows?.[0] || {};

          const _order = await this._pool.query({
            text: 'SELECT order_items.*, order_product_details.product_id FROM order_items LEFT JOIN order_product_details ON order_product_details.id = order_items.order_product_details_id WHERE order_product_details.product_id = $1 LIMIT 1',
            values: [_product?.rows?.[0].id],
          });

          _product_item_status.orders = _order?.rows || [];
        }

        return {
          ..._product_item_status,
          product_item: _product_item?.rows?.[0] || {},
        };
      }),
    );
    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows,
    };
  }

  async addUnavailableStaus(itemId, { startDate, endDate }) {
    const query = {
      text: 'INSERT INTO unavailable_status (item_id, start_date, end_date) VALUES ($1, $2, $3) RETURNING id, start_date, end_date',
      values: [itemId, startDate, endDate],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add unavailable status item');
    }
    return result.rows[0];
  }

  async getUnavailableStausByItemId(itemId) {
    const query = {
      text: 'SELECT id, start_date, end_date FROM unavailable_status WHERE item_id = $1',
      values: [itemId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return [];
    }
    return result.rows;
  }

  async verifyNewItemDates(itemId, { startDate, endDate }) {
    const query = {
      text: `SELECT id FROM unavailable_status WHERE 
      item_id = $1 AND 
      (
        (start_date <= $2 AND end_date >= $2) OR
        (start_date <= $3 AND end_date >= $3) OR
        (start_date >= $2 AND end_date <= $3)
      );`,
      values: [itemId, startDate, endDate],
    };
    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError(
        'The selected dates overlap with an existing unavailable period for this item. Please choose different start and end dates.',
      );
    }
  }

  async deleteUnavailableStatus({ statusId }, itemId) {
    const query = {
      text: 'DELETE FROM unavailable_status WHERE id = $1 AND item_id = $2 RETURNING id',
      values: [statusId, itemId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete unavailable status');
    }
    return result.rows[0];
  }
}

module.exports = UnavailableStatusService;
