/* eslint-disable no-useless-catch */
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination');

class OrdersService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async getOrdersDetailByOrderId(_order) {
    let _client = null;

    const _items = await this._pool.query({
      text: 'SELECT order_items.*, order_product_details.product_id, order_product_details.title FROM order_items LEFT JOIN order_product_details ON order_product_details.id = order_items.order_product_details_id WHERE order_id = $1',
      values: [_order.id],
    });

    const _user = await this._pool.query({
      text: 'SELECT ud.first_name, ud.last_name, u.picture FROM user_details ud LEFT JOIN users u ON u.id = ud.user_id LEFT JOIN orders o ON o.user_details_id = ud.id WHERE ud.user_id = $1 AND o.id = $2',
      values: [_order.user_id, _order.id],
    });

    if (_order.client_details_id) {
      _client = await this._pool.query({
        text: 'SELECT cl.*, ty.title FROM clients cl LEFT JOIN types ty ON ty.id = cl.type_id WHERE cl.id = $1',
        values: [_order.client_id],
      });
    }

    // console.log(_client?.rowCount);

    const itemsWithPictures = await Promise.all(
      _items.rows.map(async (_item) => {
        const prodPict = await this._pool.query({
          text: 'SELECT picture FROM product_pictures WHERE product_id = $1',
          values: [_item.product_id],
        });
        return {
          ..._item,
          ...(prodPict?.rows?.[0] || {}),
        };
      }),
    );

    return {
      items: itemsWithPictures || _items?.rows || [],
      user: _user?.rows?.[0] || {},
      client: _client?.rows?.[0] || {},
    };
  }

  async verifyOrderOwner(userId, orderId) {
    const query = {
      text: "SELECT o.id FROM orders o LEFT JOIN user_details ud ON ud.id = o.user_details_id LEFT JOIN client_details cd ON cd.id = o.client_details_id WHERE o.id = $1 AND (ud.user_id = $2 OR (cd.client_id = $2 AND o.status != 'unpaid'))",
      values: [orderId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Forbidden access to this order');
    }
  }

  async addOrder(clientDetailsId, userDetailsId, total, { startDate, endDate }) {
    const query = {
      text: 'INSERT INTO orders (user_details_id, client_details_id, start_date, end_date, total) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_details_id, client_details_id, start_date, end_date, total',
      values: [userDetailsId, clientDetailsId, startDate, endDate, total],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add order');
    }

    return result.rows[0];
  }

  async deleteOrder(orderId) {
    const query = {
      text: 'DELETE FROM orders WHERE id = $1 RETURNING id',
      values: [orderId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to delete order');
    }
    return result.rows[0];
  }

  async getOrders(params, relatedUserOrClientId) {
    const table = 'orders';
    const filterWithPagination = await filterParamsIntoQuery(
      table,
      params,
      `SELECT ${table}.*, user_details.id as user_details, user_details.user_id as user_id, client_details.client_id, (${table}.total)::INT as total FROM ${table} LEFT JOIN user_details ON user_details.id = ${table}.user_details_id LEFT JOIN client_details ON client_details.id = ${table}.client_details_id WHERE (user_details.user_id = '${relatedUserOrClientId}' OR (client_id = '${relatedUserOrClientId}' AND ${table}.status != 'unpaid'))`,
    );

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError('orders not found');
    }

    filterWithPagination.result.rows = await Promise.all(
      filterWithPagination.result.rows?.map(async (_order) => ({
        ...(_order || {}),
        ...((await this.getOrdersDetailByOrderId(_order)) || {}),
      })),
    );

    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows,
    };
  }

  async getOrderById(orderId) {
    const table = 'orders';
    const filterWithPagination = await filterParamsIntoQuery(
      table,
      null,
      `SELECT ${table}.*, user_details.id as user_details, user_details.user_id as user_id, client_details.client_id, (${table}.total)::INT as total FROM ${table} LEFT JOIN user_details ON user_details.id = ${table}.user_details_id LEFT JOIN client_details ON client_details.id = ${table}.client_details_id WHERE ${table}.id = '${orderId}'`,
    );

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError('orders not found');
    }

    filterWithPagination.result.rows = await Promise.all(
      filterWithPagination.result.rows?.map(async (_order) => ({
        ...(_order || {}),
        ...((await this.getOrdersDetailByOrderId(_order)) || {}),
      })),
    );

    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows?.[0],
    };
  }

  async getInvoiceByOrderId(id) {
    const query = {
      text: 'SELECT * FROM orders WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No invoce has been found');
    }
    return result.rows[0];
  }

  // eslint-disable-next-line class-methods-use-this
  calculateOrderPrice(productItem) {
    const orderPrice = productItem.reduce((sum, item) => sum + parseFloat(item.total), 0);
    return orderPrice;
  }

  async putOrderStatus(status, orderId) {
    const updatedDate = new Date();
    const query = {
      text: 'UPDATE orders SET status = $1, _updated_date = $2  WHERE id = $3 RETURNING id, status, _updated_date',
      values: [status, updatedDate, orderId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update order status');
    }

    return result.rows[0];
  }
  async putOrderStatus(status, orderId) {
    const updatedDate = new Date();
    const query = {
      text: 'UPDATE orders SET status = $1, _updated_date = $2  WHERE id = $3 RETURNING id, status, _updated_date',
      values: [status, updatedDate, orderId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update order status');
    }

    return result.rows[0];
  }
  async getAllOrdersWithPagination({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const query = {
      text: `
      SELECT
        o.*,
        u.username,
        c.name AS client_name
      FROM orders o
      LEFT JOIN user_details ud ON o.user_details_id = ud.id
      LEFT JOIN users u ON ud.user_id = u.id
      LEFT JOIN client_details cd ON o.client_details_id = cd.id
      LEFT JOIN clients c ON cd.client_id = c.id
      ORDER BY o._created_date DESC
      LIMIT $1 OFFSET $2
    `,
      values: [limit, offset],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No orders found');
    }

    // Optional: dapatkan total count
    const totalQuery = await this._pool.query('SELECT COUNT(*) FROM orders');
    const total = parseInt(totalQuery.rows[0].count);

    return {
      total,
      page,
      limit,
      result: result.rows,
    };
  }

  async updateOrderById(orderId, payload) {
    const fields = [];
    const values = [];
    let index = 1;

    if ('start_date' in payload) {
      fields.push(`start_date = $${index++}`);
      values.push(payload.start_date);
    }

    if ('end_date' in payload) {
      fields.push(`end_date = $${index++}`);
      values.push(payload.end_date);
    }

    if ('total' in payload) {
      fields.push(`total = $${index++}`);
      values.push(payload.total);
    }

    if ('status' in payload) {
      fields.push(`status = $${index++}`);
      values.push(payload.status);
    }

    if (fields.length === 0) {
      throw new InvariantError('No valid fields provided to update');
    }

    fields.push(`_updated_date = CURRENT_TIMESTAMP`);

    const query = {
      text: `UPDATE orders SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
      values: [...values, orderId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update order. Order not found');
    }

    return result.rows[0];
  }
  async deleteOrderById(orderId) {
    const query = {
      text: 'DELETE FROM orders WHERE id = $1 RETURNING id',
      values: [orderId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete order. ID not found');
    }

    return result.rows[0];
  }
}

module.exports = OrdersService;
