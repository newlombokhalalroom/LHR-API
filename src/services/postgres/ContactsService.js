const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { createDatabasePool } = require('../../utils/config');
const { mapContactToModel } = require('../../utils/mapToModel');

class ContactsService {
  constructor(cacheService) {
    this._pool = createDatabasePool();
    this._cacheService = cacheService;
  }

  async verifyNewEmail(email, userId = null) {
    const query = {
      text: userId
        ? 'SELECT * FROM contacts WHERE email = $1 AND user_id != $2'
        : 'SELECT * FROM contacts WHERE email = $1',
      values: userId ? [email, userId] : [email],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('Email already exists');
    }
  }

  async addContactByUserId(userId, email) {
    const query = {
      text: 'INSERT INTO contacts (user_id, email) VALUES ($1, $2)',
      values: [userId, email],
    };
    await this._pool.query(query);
  }

  async getContactByUserId(userId) {
    const query = {
      text: 'SELECT * FROM contacts WHERE user_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    return mapContactToModel(result.rows[0]);
  }

  async editContactByUserId(userId, contactData) {
    const {
      firstName, lastName, email, phone,
    } = contactData;

    const updatedAt = new Date();
    const registeredEmail = await this.getEmailByUserId(userId);
    let registeredEmailVerifiedStatus = await this.getEmailVerifiedStatusByUserId(userId);

    if (email !== registeredEmail) {
      await this.verifyNewEmail(email, userId);
      registeredEmailVerifiedStatus = false;
    }

    const query = {
      text: 'UPDATE contacts SET first_name = $1, last_name = $2, email = $3, phone = $4, _is_email_verified = $5, _updated_date = $6 WHERE user_id = $7',
      values: [firstName, lastName, email, phone, registeredEmailVerifiedStatus, updatedAt, userId],
    };
    await this._pool.query(query);
  }

  async getEmailByUserId(userId) {
    const query = {
      text: 'SELECT email FROM contacts WHERE user_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("User's email address is not found");
    }
    return result.rows[0].email;
  }

  async getEmailVerifiedStatusByUserId(userId) {
    const query = {
      text: 'SELECT _is_email_verified FROM contacts WHERE user_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("User's email address is not found");
    }
    return result.rows[0]._is_email_verified;
  }

  async validateVerificationCode(userId, code) {
    const validCode = await this._cacheService.get(`VerificationCode:${userId}`);
    if (code !== validCode) {
      throw new InvariantError('Code is invalid');
    }
    await this._cacheService.delete(`VerificationCode:${userId}`);

    const query = {
      text: 'UPDATE contacts SET _is_email_verified = true WHERE user_id = $1',
      values: [userId],
    };
    await this._pool.query(query);
  }

  async isEmailRegistered(email) {
    const query = {
      text: 'SELECT * FROM contacts WHERE email = $1',
      values: [email],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Email address is not registered yet');
    }
  }

  async validateResetPasswordCode(code) {
    let validEmail;
    try {
      validEmail = await this._cacheService.get(`ResetPasswordCode:${code}`);
    } catch (e) {
      throw new InvariantError('Code is Invalid');
    }

    await this._cacheService.delete(`ResetPasswordCode:${code}`);
    const query = {
      text: 'SELECT user_id FROM contacts WHERE email = $1',
      values: [validEmail],
    };

    const result = await this._pool.query(query);
    return result.rows[0].user_id;
  }

  async getClientContactByClientDetailsId(clientDetailsId) {
    const query = {
      text: `SELECT c.*
        FROM contacts c
        JOIN users u ON u.id = c.user_id
        JOIN clients cl ON cl.owner_id = u.id
        JOIN client_details cd ON cd.client_id = cl.id 
        WHERE cd.id = $1`,
      values: [clientDetailsId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Client's contact is not found");
    }
    return result.rows[0];
  }

  async getUserContactByUserDetailsId(userDetailsId) {
    const query = {
      text: `SELECT c.*
        FROM contacts c
        JOIN users u ON u.id = c.user_id
        JOIN user_details ud ON ud.user_id = u.id 
        WHERE ud.id = $1`,
      values: [userDetailsId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("User's contact is not found");
    }
    return result.rows[0];
  }
}

module.exports = ContactsService;