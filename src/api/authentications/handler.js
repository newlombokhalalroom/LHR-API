const autoBind = require('auto-bind');
const { isEmail } = require('../../utils/isEmail');

class AuthenticationHandler {
  constructor(authenticationsService, usersService, tokenManager, authenticationsValidator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._authenticationsValidator = authenticationsValidator;
    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._authenticationsValidator.validatePostAuthenticationPayload(request.payload);
    const { usernameOrEmail, password } = request.payload;
    let credential;
    if (isEmail(usernameOrEmail)) {
      credential = await this._usersService.verifyUserCredentialWithEmail(
        usernameOrEmail,
        password,
      );
    } else {
      credential = await this._usersService.verifyUserCredentialWithUsername(
        usernameOrEmail,
        password,
      );
    }
    const accessToken = this._tokenManager.generateAccessToken(credential);
    const refreshToken = this._tokenManager.generateRefreshToken(credential);
    await this._authenticationsService.addRefreshToken(refreshToken);
    const response = h.response({
      status: true,
      message: 'Authentication added successfully',
      result: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    this._authenticationsValidator.validatePutAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id, scope } = await this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id, scope });
    return {
      status: true,
      message: 'Authentication updated successfully',
      result: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    this._authenticationsValidator.validateDeleteAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);
    return {
      status: true,
      message: 'Authentication deleted successfully',
    };
  }
}

module.exports = AuthenticationHandler;
