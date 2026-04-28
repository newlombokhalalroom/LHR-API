/* eslint-disable no-useless-catch */
/* eslint-disable no-dupe-class-members */
const uuid = require('uuid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { createDatabasePool } = require('../../utils/config');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination');

class ProductsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async getProductsDetailByProductId(productId, clientId) {
    let _client = null;
    const _amenities = await this._pool.query({
      text: 'SELECT * FROM product_amenities INNER JOIN amenities ON amenities.id = product_amenities.amenity_id WHERE product_amenities.product_id = $1',
      values: [productId],
    });
    const _pictures = await this._pool.query({
      text: 'SELECT id, picture, title, description FROM product_pictures WHERE product_id = $1',
      values: [productId],
    });
    const _details = await this._pool.query({
      text: 'SELECT d.id, d.title, pd.amount FROM product_details pd LEFT JOIN details d ON pd.detail_id = d.id WHERE pd.product_id = $1',
      values: [productId],
    });
    const _items = await this._pool.query({
      text: 'SELECT id, title FROM product_items WHERE product_id = $1',
      values: [productId],
    });
    const _policies = await this._pool.query({
      text: 'SELECT pp.policy_id, p.title, p.category, p.description, pp.details FROM products_policies pp LEFT JOIN policies p ON pp.policy_id = p.id WHERE pp.product_id = $1',
      values: [productId],
    });

    if (clientId) {
      _client = await this._pool.query({
        text: 'SELECT cl.*, ty.title FROM clients cl LEFT JOIN types ty ON ty.id = cl.type_id WHERE cl.id = $1',
        values: [clientId],
      });
    }

    return {
      items: _items?.rows || [],
      details: _details?.rows || [],
      amenities: _amenities?.rows || [],
      pictures: _pictures?.rows || [],
      policies: _policies?.rows || [],
      client: _client?.rows?.[0] || [],
    };
  }

  async getProducts(params) {
    const table = 'products';

    const filterWithPagination = await filterParamsIntoQuery(
      table,
      params,
      `SELECT ${table}.*, types.title as type FROM ${table} INNER JOIN clients ON clients.id = ${table}.client_id INNER JOIN types ON types.id = clients.type_id`,
    );

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError('products not found');
    }

    filterWithPagination.result.rows = await Promise.all(
      filterWithPagination.result.rows?.map(async (_product) => ({
        ...(_product || {}),
        ...((await this.getProductsDetailByProductId(_product.id, _product.client_id)) || {}),
      })),
    );

    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows,
    };
  }

  async getProductsByClientId(clientId, params = null) {
    const table = 'products';
    const filterWithPagination = await filterParamsIntoQuery(
      table,
      params,
      `SELECT ${table}.* FROM ${table} INNER JOIN clients ON clients.id = ${table}.client_id INNER JOIN types ON types.id = clients.type_id WHERE ${table}.client_id = '${clientId}'`,
    );

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError('products not found');
    }

    filterWithPagination.result.rows = await Promise.all(
      filterWithPagination.result.rows?.map(async (_product) => ({
        ...(_product || {}),
        ...((await this.getProductsDetailByProductId(_product.id, clientId)) || {}),
      })),
    );

    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows,
    };
  }

  async getProductById(id) {
    const table = 'products';

    const filterWithPagination = await filterParamsIntoQuery(
      table,
      null,
      `SELECT * FROM ${table} WHERE id = '${id}'`,
    );

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError('products not found');
    }

    filterWithPagination.result.rows = await Promise.all(
      filterWithPagination.result.rows?.map(async (_product) => ({
        ...(_product || {}),
        ...((await this.getProductsDetailByProductId(_product.id, _product.client_id)) || {}),
      })),
    );

    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows?.[0],
    };
  }
  // etc

  async verifyClientProduct(arrayOfProductId, clientId) {
    const placeholders = arrayOfProductId.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT * FROM products WHERE id IN (${placeholders}) AND client_id = $${
      arrayOfProductId.length + 1
    }`;
    const query = {
      text: queryText,
      values: [...arrayOfProductId, clientId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount < arrayOfProductId.length) {
      throw new InvariantError('Invalid product for this client');
    }

    return result.rows;
  }

  async addProduct(clientId, { id = uuid.v4(), title, description, availability, price, units }) {
    const query = {
      text: 'INSERT INTO products (id, client_id, title, description, availability, price, units) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, client_id, title, description, availability, price, units',
      values: [id, clientId, title, description, availability, price, units],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add product');
    }

    return result.rows[0];
  }

  // todo: duplicate, missing result
  // eslint-disable-next-line consistent-return
  // async getProductsByClientId(clientId, { page = 1, limit = 100 }) {
  //   const offset = (page - 1) * limit;
  //   const query = {
  //     text: `SELECT id, title, description, availability, price, units FROM products
  //       WHERE client_id = $1
  //       ORDER BY products.title
  //       LIMIT $2
  //       OFFSET $3
  //     `,
  //     values: [clientId, limit, offset],
  //   };
  //   const result = await this._pool.query(query);
  //   result.rows = await Promise.all(
  //     result.rows?.map(async (product) => {
  //       const pictures = await this._pool.query({
  //         text: 'SELECT id, picture, title, description FROM product_pictures WHERE product_id = $1',
  //         values: [product.id],
  //       });
  //       const details = await this._pool.query({
  //         text: 'SELECT d.id, d.title, pd.amount FROM product_details pd LEFT JOIN details d ON pd.detail_id = d.id WHERE pd.product_id = $1',
  //         values: [product.id],
  //       });
  //       return {
  //         ...product,
  //         details: details?.rows || [],
  //         pictures: pictures?.rows || [],
  //       };
  //     }),
  //   );
  //   if (!result.rowCount) {
  //     return {
  //       count: 0,
  //       pages: 1,
  //       result: [],
  //     };
  //   }
  //   return result.rows;
  // }

  // etc

  async verifyClientProduct(arrayOfProductId, clientId) {
    const placeholders = arrayOfProductId.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT * FROM products WHERE id IN (${placeholders}) AND client_id = $${
      arrayOfProductId.length + 1
    }`;
    const query = {
      text: queryText,
      values: [...arrayOfProductId, clientId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount < arrayOfProductId.length) {
      throw new InvariantError('Invalid product for this client');
    }

    return result.rows;
  }

  async addProduct(clientId, { id = uuid.v4(), title, description, availability, price, units }) {
    const query = {
      text: 'INSERT INTO products (id, client_id, title, description, availability, price, units) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, client_id, title, description, availability, price, units',
      values: [id, clientId, title, description, availability, price, units],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add product');
    }

    return result.rows[0];
  }

  async updateProductById(productId, { title, description, availability, price, units }) {
    const updateAt = new Date();
    const query = {
      text: 'UPDATE products SET title = $1, description = $2, availability = $3, price = $4, units = $5, _updated_date = $6 WHERE id = $7 RETURNING id, title, description, availability, price, units',
      values: [title, description, availability, price, units, updateAt, productId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update product');
    }

    return result.rows[0];
  }

  async verifyClientAccess(productId, clientId) {
    const query = {
      text: 'SELECT * FROM products WHERE id = $1 AND client_id = $2',
      values: [productId, clientId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Forbidden access to this product');
    }
  }

  async deleteProduct(productId) {
    const query = {
      text: 'DELETE FROM products WHERE id = $1 RETURNING *',
      values: [productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete this product');
    }
    return result.rows[0];
  }

  // probably not needed
  async getProductPricesById(arrayOfProductId) {
    const placeholders = arrayOfProductId.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT id, price FROM products WHERE id IN (${placeholders})`;
    const query = {
      text: queryText,
      values: [...arrayOfProductId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Invalid product for this client');
    }

    return result.rows;
  }

  async getProductsById(arrayOfProductId) {
    const placeholders = arrayOfProductId.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `SELECT * FROM products WHERE id IN (${placeholders})`;
    const query = {
      text: queryText,
      values: [...arrayOfProductId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No Products has been found');
    }

    return result.rows;
  }

  async getCars(options) {
    let baseQuery = `SELECT DISTINCT p.* FROM products p
      LEFT JOIN clients c ON c.id = p.client_id
      LEFT JOIN locations l ON l.client_id = c.id
      LEFT JOIN product_items pi ON pi.product_id = p.id
      LEFT JOIN unavailable_status us ON us.item_id = pi.id
      LEFT JOIN product_amenities pa ON pa.product_id = p.id
      LEFT JOIN product_details pd ON pd.product_id = p.id
      LEFT JOIN details d ON pd.detail_id = d.id
      WHERE 1 = 1`;

    const values = [];

    if (options.type) {
      baseQuery += ` AND c.type_id IN (SELECT id FROM types WHERE title = $${values.length + 1})`;
      values.push(options.type);
    }
    if (options.city) {
      baseQuery += ` AND l.city = $${values.length + 1}`;
      values.push(options.city);
    }
    if (options.startDate && options.endDate) {
      baseQuery += ` AND pi.id NOT IN (
      SELECT item_id FROM unavailable_status WHERE
        (start_date <= $${values.length + 1} AND end_date >= $${values.length + 2}) OR 
        (start_date <= $${values.length + 2} AND end_date >= $${values.length + 1}) OR 
        (start_date >= $${values.length + 1} AND end_date <= $${values.length + 2})
      )`;
      values.push(options.startDate, options.endDate);
    }
    if (options.amenity) {
      baseQuery += ` AND pa.amenity_id IN (SELECT id FROM amenities WHERE title = $${
        values.length + 1
      })`;
      values.push(options.amenity);
    }
    if (options.detailTitle && options.detailAmount) {
      baseQuery += ` AND d.title = $${values.length + 1} AND pd.amount = $${values.length + 2}`;
      values.push(options.detailTitle, options.detailAmount);
    }

    const query = {
      text: baseQuery,
      values,
    };

    const result = await this._pool.query(query);//20

    result.rows = await Promise.all(
      result.rows?.map(async (product) => {
        const details = await this._pool.query({
          text: `SELECT d.id, d.title, pd.amount FROM product_details pd 
            LEFT JOIN details d ON pd.detail_id = d.id 
            WHERE pd.product_id = $1`,
          values: [product.id],
        });
        const pictures = await this._pool.query({
          text: 'SELECT id, picture, title, description FROM product_pictures WHERE product_id = $1',
          values: [product.id],
        });
        const client = await this._pool.query({
          text: 'SELECT * FROM clients WHERE id = $1',
          values: [product.client_id],
        });
        return {
          ...product,
          details: details?.rows || [],
          pictures: pictures?.rows || [],
          client: client?.rows[0] || [],
        };
      }),
    );

    if (!result.rowCount) {
      throw new NotFoundError('No Products have been found');
    }

    return result.rows;
  }

  async updateProductAvailability(productId, unavailableStatus) {
    const query = {
      text: 'UPDATE products SET availability = $1 WHERE id = $2 RETURNING id, title, availability',
      values: [unavailableStatus, productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to update product availability');
    }
    return result.rows[0];
  }
}

module.exports = ProductsService;
