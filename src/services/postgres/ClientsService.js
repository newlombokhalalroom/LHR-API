const { v4 } = require('uuid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination');

class ClientsService {
  constructor() {
    this._pool = createDatabasePool();
  }

  async getClientsDetail(_client) {
    const _pictures = await this._pool.query({
      text: 'SELECT * FROM client_pictures WHERE client_id = $1',
      values: [_client.id],
    });

    const _location = await this._pool.query({
      text: 'SELECT address, city, province, ST_X(coordinate::geometry) AS longitude, ST_Y(coordinate::geometry) AS latitude FROM locations WHERE client_id = $1',
      values: [_client.id],
    });

    const _product = (
      await this._pool.query({
        text: 'SELECT * FROM products WHERE client_id = $1 ORDER BY price ASC LIMIT 1',
        values: [_client.id],
      })
    ).rows?.[0];

    if (_product?.id) {
      const _productPictures = await this._pool.query({
        text: 'SELECT id, picture, title, description FROM product_pictures WHERE product_id = $1',
        values: [_product.id],
      });
      _product.pictures = _productPictures?.rows;
    }

    return {
      ..._client,
      product: _product || {},
      clientPictures: _pictures?.rows || [],
      clientLocation: _location?.rows?.[0] || {},
    };
  }

  async getAllClientsWithUnapproved(params) {
    const table = 'clients';

    const filterWithPagination = await filterParamsIntoQuery(
      table,
      params,
      `SELECT ${table}.*, type.title FROM ${table} LEFT JOIN types type ON type.id = ${table}.type_id`,
    );

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError('No clients have been found');
    }

    filterWithPagination.result.rows = await Promise.all(
      filterWithPagination.result.rows?.map(async (_client) => ({
        ...(_client || {}),
        ...((await this.getClientsDetail(_client)) || {}),
      })),
    );
    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows,
    };
  }

  async getAllClientsApproved() {
    const query = {
      text: 'SELECT cl.*, ty.title FROM clients cl LEFT JOIN types ty ON ty.id = cl.type_id WHERE cl.approved_by IS NOT NULL',
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No clients have been found');
    }
    return result.rows;
  }

  async verifyNewClientName(name) {
    const query = {
      text: 'SELECT id FROM clients WHERE name = $1',
      values: [name],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Clients name already exists');
    }
  }

  async addClient(
    owner_id,
    type_id,
    { id = v4(), name, email, phone, npwp, picture, description },
  ) {
    const query = {
      text: 'INSERT INTO clients(id, type_id, owner_id, name, email, phone, npwp, picture, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      values: [id, type_id, owner_id, name, email, phone, npwp, picture, description],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add client');
    }

    return result.rows[0].id;
  }

  async updateClient(
    owner_id,
    type_id,
    { name = null, email = null, phone = null, npwp = null, picture = null, description = null },
  ) {
    const updateAt = new Date();
    const query = {
      text: 'UPDATE clients SET type_id = COALESCE($1, type_id), name = COALESCE($2, name), email = COALESCE($3, email), phone = COALESCE($4, phone) , npwp = COALESCE($5,npwp) , picture = COALESCE($6, picture) , description = COALESCE($7, description) , _updated_date = $8 WHERE owner_id = $9 RETURNING id, type_id, owner_id, approved_by, name, email, phone, npwp, picture, description',
      values: [type_id, name, email, phone, npwp, picture, description, updateAt, owner_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update client');
    }

    return result.rows[0];
  }

  async getUnapprovedClients() {
    const query = {
      text: 'SELECT cl.id, cl.name, ty.title FROM clients cl LEFT JOIN types ty ON ty.id = cl.type_id WHERE cl.approved_by IS NULL',
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('No unapproved clients have been found');
    }
    return result.rows;
  }

  // TODO: add client pictures
  // async oldGetAllClients(page = 1, limit = 100) {
  //   const offset = (page - 1) * limit;
  //   const query = {
  //     text: `
  //       SELECT cl.*, ty.title
  //       FROM clients cl
  //       LEFT JOIN types ty ON ty.id = cl.type_id
  //       WHERE cl.approved_by IS NOT NULL
  //       ORDER BY cl.id
  //       LIMIT $1
  //       OFFSET $2
  //     `,
  //     values: [limit, offset],
  //   };
  //   const result = await this._pool.query(query);
  //   result.rows = await Promise.all(
  //     result.rows?.map(async (client) => {
  //       const pictures = await this._pool.query({
  //         text: 'SELECT * FROM client_pictures WHERE client_id = $1',
  //         values: [client.id],
  //       });
  //       return {
  //         ...client,
  //         pictures: pictures?.rows || [],
  //       };
  //     }),
  //   );
  //   if (!result.rowCount) {
  //     throw new NotFoundError('No clients have been found');
  //   }
  //   return result.rows;
  // }

  async getAllClients(page = 1, limit = 100, params = {}) {
    const table = 'clients';
    params.page = page;
    params.limit = limit;

    const filterWithPagination = await filterParamsIntoQuery(
      table,
      params,
      `
      SELECT ${table}.*, types.title 
      FROM ${table} 
      LEFT JOIN types ON types.id =  ${table}.type_id 
      WHERE  ${table}.approved_by IS NOT NULL
    `,
    );

    if (!filterWithPagination?.result.rowCount) {
      throw new NotFoundError('No clients have been found');
    }

    filterWithPagination.result.rows = await Promise.all(
      filterWithPagination.result.rows?.map(async (_client) => ({
        ...(_client || {}),
        ...((await this.getClientsDetail(_client)) || {}),
      })),
    );

    return {
      total: filterWithPagination.total,
      count: filterWithPagination.count,
      pages: filterWithPagination.pages,
      result: filterWithPagination.result.rows,
    };
  }

  async getClientById(id) {
    const query = {
      text: 'SELECT cl.*, ty.title FROM clients cl LEFT JOIN types ty ON ty.id = cl.type_id WHERE cl.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No client has been found');
    }
    return result.rows[0];
  }

  async putClientApproval(superAdminId, clientId) {
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE clients SET approved_by = $1, _updated_date = $2 WHERE id = $3 RETURNING id',
      values: [superAdminId, updatedAt, clientId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to approve client');
    }
  }

  async verifyNewClientOwner(owner_id) {
    const query = {
      text: 'SELECT id FROM clients WHERE owner_id = $1',
      values: [owner_id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Owner already has a client');
    }
  }

  async getClientIdbyOwnerId(owner_id) {
    const query = {
      text: 'SELECT id FROM clients WHERE owner_id = $1',
      values: [owner_id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('User does not have a client information');
    }
    return result.rows[0];
  }

  async getClientNameByOwnerId(owner_id) {
    const query = {
      text: 'SELECT name FROM clients WHERE owner_id = $1',
      values: [owner_id],
    };

    const result = await this._pool.query(query);

    return result.rows[0].name;
  }

  async getClientByOwnerId(owner_id) {
    const query = {
      text: 'SELECT clients.*, types.title as type FROM clients LEFT JOIN types ON clients.type_id = types.id WHERE owner_id = $1',
      values: [owner_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User does not have a client information');
    }
    return result.rows[0];
  }

  async getUserByClientId(client_id) {
    const query = {
      text: 'SELECT owner_id FROM clients WHERE id = $1',
      values: [client_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No owner has been found');
    }

    return result.rows[0];
  }
}

module.exports = ClientsService;
