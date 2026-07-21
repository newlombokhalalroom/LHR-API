const InvariantError = require('../../exceptions/InvariantError');

const PREFIX = 'RefreshToken';

class AuthenticationsService {
  constructor(cacheService) {
    this._cache = cacheService;
  }

  async addRefreshToken(token) {
    await this._cache.set(`${PREFIX}:${token}`, token, 7 * 24 * 3600);
  }

  async verifyRefreshToken(token) {
    try {
      await this._cache.get(`${PREFIX}:${token}`);
    } catch {
      throw new InvariantError('Refresh token is not valid');
    }
  }

  async deleteRefreshToken(token) {
    await this._cache.delete(`${PREFIX}:${token}`);
  }
}

module.exports = AuthenticationsService;
