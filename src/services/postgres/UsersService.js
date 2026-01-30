const bcrypt = require('bcrypt');
const { v4 } = require('uuid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const { filterParamsIntoQuery } = require('../../utils/filterWithPagination');
const { buildUpdateQuery } = require('../../utils/buildUpdateQuery');

class UsersService {
  constructor(cacheService, userRolesService) {
    this._pool = createDatabasePool();
    this._cacheService = cacheService;
    this._userRolesService = userRolesService;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Username already exists');
    }
  }

  async addUser({ id = v4(), username, password, picture = null }) {
    await this.verifyNewUsername(username);
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users(id, username, password, picture) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, picture],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to add user');
    }
    return result.rows[0].id;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, role_id, username, picture, _created_date, _updated_date FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('User not found');
    }
    return result.rows[0];
  }

  async verifyUserCredentialWithUsername(username, password) {
    const query = {
      text: 'SELECT u.id, u.password, r.title FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError(`${username} is not registered`);
    }
    const { id, password: hashedPassword, title } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Password is incorrect');
    }

    return { id, scope: title };
  }

  async verifyUserCredentialWithEmail(email, password) {
    const query = {
      text: 'SELECT u.id, u.password, r.title FROM users u LEFT JOIN roles r ON r.id = u.role_id LEFT JOIN contacts c ON c.user_id = u.id WHERE c.email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError(`${email} is not registered`);
    }

    const { id, password: hashedPassword, title } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Password is incorrect');
    }

    return { id, scope: title };
  }

  async verifyOldPassword(id, password) {
    const query = {
      text: 'SELECT password FROM users WHERE id = $1',
      values: [id],
    };
    const { password: hashedPassword } = (await this._pool.query(query)).rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('Old password is incorrect');
    }
  }

  async changeUserPassword(id, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE users SET password = $1, _updated_date = $2 WHERE id = $3 RETURNING id',
      values: [hashedPassword, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to change password');
    }
  }

  async addUserPicture(userId, url) {
    const updatedAt = new Date();
    const query = {
      text: 'UPDATE users SET picture = $1, _updated_date = $2 WHERE id = $3',
      values: [url, updatedAt, userId],
    };
    await this._pool.query(query);
  }

  async addAdminRole(userId) {
    const roleId = await this._userRolesService.getRoleId('admin');
    const query = {
      text: 'UPDATE users SET role_id = $1 WHERE id = $2',
      values: [roleId, userId],
    };
    await this._pool.query(query);
  }

  async addUserRole(userId) {
    const roleId = await this._userRolesService.getRoleId('user');
    const query = {
      text: 'UPDATE users SET role_id = $1 WHERE id = $2',
      values: [roleId, userId],
    };
    await this._pool.query(query);
  }

  async changeUsername(newUsername, userId) {
    console.log(newUsername, userId);
    const query = {
      text: 'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username',
      values: [newUsername, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to change username');
    }

    return result.rows[0];
  }

  // SUPER ADMIN SERVICES METHODS
  async getAllUsers(page = 1, limit = 10, params = {}) {
    const table = 'users';
    params.page = page;
    params.limit = limit;

    const query = `
    SELECT 
      users.id, 
      users.username, 
      users.picture, 
      users._created_date AS user_created_date,
      users._updated_date AS user_updated_date,
      users.provider, 
      users."providerId",
      contacts.first_name, 
      contacts.last_name, 
      contacts.email, 
      contacts.phone, 
      contacts._is_email_verified, 
      contacts._is_phone_verified,
      contacts._created_date AS contact_created_date,
      contacts._updated_date AS contact_updated_date,
      roles.title AS role_title
    FROM users
    LEFT JOIN contacts ON contacts.user_id = users.id
    LEFT JOIN roles ON roles.id = users.role_id
  `;

    const {
      total,
      count,
      limit: finalLimit,
      pages,
      result: rawResult,
    } = await filterParamsIntoQuery(table, params, query);

    return {
      total,
      count,
      limit: finalLimit,
      pages,
      result: rawResult.rows,
    };
  }

  // eslint-disable-next-line no-dupe-class-members
  async getUserById(id) {
    try {
      const query = `
    SELECT 
      users.id, 
      users.username, 
      users.picture, 
      users.role_id,                       
      users._created_date AS user_created_date,
      users._updated_date AS user_updated_date,
      users.provider, 
      users."providerId",
      contacts.first_name, 
      contacts.last_name, 
      contacts.email, 
      contacts.phone, 
      contacts._is_email_verified, 
      contacts._is_phone_verified,
      contacts._created_date AS contact_created_date,
      contacts._updated_date AS contact_updated_date,
      roles.title AS role_title
    FROM users
    LEFT JOIN contacts ON contacts.user_id = users.id
    LEFT JOIN roles ON roles.id = users.role_id
    WHERE users.id = $1
    LIMIT 1
    `;

      const result = await this._pool.query(query, [id]);

      if (!result.rows.length) {
        throw new Error(`User with ID ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  async updateUserById(id, payload) {
    const client = await this._pool.connect();
    try {
      await client.query('BEGIN');

      // ✅ Jika role_title diberikan, ubah ke role_id dulu
      if ('role_title' in payload && !payload.role_id) {
        const roleQuery = await client.query('SELECT id FROM roles WHERE title = $1 LIMIT 1', [
          payload.role_title,
        ]);

        if (!roleQuery.rowCount) {
          throw new Error(`Role with title "${payload.role_title}" not found`);
        }

        payload.role_id = roleQuery.rows[0].id;
      }

      // 🔧 Persiapkan update untuk tabel users
      const userFields = [];
      const userValues = [];
      let userIndex = 1;

      if ('username' in payload) {
        userFields.push(`username = $${userIndex++}`);
        userValues.push(payload.username);
      }
      if ('picture' in payload) {
        userFields.push(`picture = $${userIndex++}`);
        userValues.push(payload.picture);
      }
      if ('provider' in payload) {
        userFields.push(`provider = $${userIndex++}`);
        userValues.push(payload.provider);
      }
      if ('providerId' in payload) {
        userFields.push(`"providerId" = $${userIndex++}`);
        userValues.push(payload.providerId);
      }
      if ('role_id' in payload) {
        userFields.push(`role_id = $${userIndex++}`);
        userValues.push(payload.role_id);
      }

      if (userFields.length > 0) {
        userFields.push('_updated_date = CURRENT_TIMESTAMP');
        await client.query(`UPDATE users SET ${userFields.join(', ')} WHERE id = $${userIndex}`, [
          ...userValues,
          id,
        ]);
      }

      const contactFields = [];
      const contactValues = [];
      let contactIndex = 1;

      if ('first_name' in payload) {
        contactFields.push(`first_name = $${contactIndex++}`);
        contactValues.push(payload.first_name);
      }
      if ('last_name' in payload) {
        contactFields.push(`last_name = $${contactIndex++}`);
        contactValues.push(payload.last_name);
      }
      if ('email' in payload) {
        contactFields.push(`email = $${contactIndex++}`);
        contactValues.push(payload.email);
      }
      if ('phone' in payload) {
        contactFields.push(`phone = $${contactIndex++}`);
        contactValues.push(payload.phone);
      }
      if ('_is_email_verified' in payload) {
        contactFields.push(`_is_email_verified = $${contactIndex++}`);
        contactValues.push(payload._is_email_verified);
      }
      if ('_is_phone_verified' in payload) {
        contactFields.push(`_is_phone_verified = $${contactIndex++}`);
        contactValues.push(payload._is_phone_verified);
      }

      if (contactFields.length > 0) {
        contactFields.push('_updated_date = CURRENT_TIMESTAMP');
        await client.query(
          `UPDATE contacts SET ${contactFields.join(', ')} WHERE user_id = $${contactIndex}`,
          [...contactValues, id],
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error updating user:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteUserById(id) {
    try {
      const result = await this._pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

      if (!result.rowCount) {
        throw new Error(`User with ID ${id} not found`);
      }

      return { deletedId: result.rows[0].id };
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
  }
  async verifyNewEmail(email) {
    const q = await this._pool.query('SELECT user_id FROM contacts WHERE email = $1 LIMIT 1', [
      email,
    ]);
    if (q.rowCount) throw new InvariantError('Email sudah digunakan');
  }
  async addUserByRoleTitle(
    roleTitle,
    {
      id = v4(),
      username,
      password,
      picture = null,
      email,
      phone = null,
      first_name = null,
      last_name = null,
    },
  ) {
    const allowed = new Set(['user', 'admin']);
    if (!allowed.has(roleTitle)) {
      throw new InvariantError('Role tidak valid. Hanya "user" atau "admin"');
    }

    const client = await this._pool.connect();
    try {
      await client.query('BEGIN');

      await this.verifyNewUsername(username);
      if (email) await this.verifyNewEmail(email);

      const roleQuery = await client.query('SELECT id FROM roles WHERE title = $1 LIMIT 1', [
        roleTitle,
      ]);

      if (!roleQuery.rowCount) {
        throw new InvariantError(
          `Role "${roleTitle}" tidak ditemukan. Pastikan tabel roles terisi.`,
        );
      }

      const roleId = roleQuery.rows[0].id;
      const hashedPassword = await bcrypt.hash(password, 10);

      const userInsert = await client.query(
        `INSERT INTO users(id, username, password, picture, role_id)
         VALUES($1, $2, $3, $4, $5)
         RETURNING id`,
        [id, username, hashedPassword, picture, roleId],
      );

      if (!userInsert.rowCount) throw new InvariantError('Failed to add user');

      await client.query(
        `INSERT INTO contacts(user_id, first_name, last_name, email, phone, _is_email_verified, _is_phone_verified)
         VALUES($1, $2, $3, $4, $5, $6, $7)`,
        [id, first_name, last_name, email, phone, false, false],
      );

      await client.query('COMMIT');
      return userInsert.rows[0].id;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error addUserByRoleTitle:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = UsersService;
