const { customAlphabet } = require('nanoid');
const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator, contactsService, sendEmailService, balancesService) {
    this._service = service;
    this._validator = validator;
    this._contactsService = contactsService;
    this._sendEmailService = sendEmailService;
    this._balancesService = balancesService;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { id, username, email, password, picture } = request.payload;
    await this._contactsService.verifyNewEmail(email);

    const userId = await this._service.addUser({ id, username, password, picture });
    await this._balancesService.addDefaultBalanceByUserId(userId);
    await this._service.addUserRole(userId);
    await this._contactsService.addContactByUserId(userId, email);

    return h
      .response({
        status: true,
        message: 'user added successfully',
        result: {
          userId,
        },
      })
      .code(201);
  }

  async getUserByIdHandler(request) {
    this._validator.validateUserParams(request.params);
    const { id } = request.params;
    const user = await this._service.getUserById(id);
    return {
      status: true,
      result: user,
    };
  }

  async sendResetPasswordCodeByEmailHandler(request) {
    const { email } = request.payload;

    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generateRandomString = customAlphabet(charset, 6);

    const code = generateRandomString();
    await this._contactsService.isEmailRegistered(email);
    await this._sendEmailService.sendResetPasswordEmail(email, code);
    return {
      status: true,
      message: 'Reset password code sent successfully',
    };
  }

  async resetUserPasswordHandler(request) {
    this._validator.validateUserResetPasswordPayload(request.payload);
    const { code, newPassword } = request.payload;
    const userId = await this._contactsService.validateResetPasswordCode(code);
    await this._service.changeUserPassword(userId, newPassword);
    return {
      status: true,
      message: 'The password has been reset successfully',
    };
  }

  async changeUserPasswordHandler(request) {
    this._validator.validateUserChangePasswordPayload(request.payload);
    const { oldPassword, newPassword } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyOldPassword(credentialId, oldPassword);
    await this._service.changeUserPassword(credentialId, newPassword);
    return {
      status: true,
      message: 'Password has changed successfully',
    };
  }

  async putUserPictureUrlHandler(request) {
    this._validator.validateUserPictureUrl(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { url } = request.payload;
    await this._service.addUserPicture(credentialId, url);
    return {
      status: true,
      message: 'Picture was successfully updated',
    };
  }

  async postUserAsAdminHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { id, username, email, password, picture } = request.payload;

    await this._contactsService.verifyNewEmail(email);

    const userId = await this._service.addUser({ id, username, password, picture });
    await this._balancesService.addDefaultBalanceByUserId(userId);
    await this._service.addAdminRole(userId);

    await this._contactsService.addContactByUserId(userId, email);

    return h
      .response({
        status: true,
        message: 'admin added successfully',
        result: {
          userId,
        },
      })
      .code(201);
  }

  async getUserBalanceHandler(request) {
    const { id } = request.auth.credentials;
    const balance = await this._balancesService.getBalanceByUserId(id);
    return {
      status: true,
      result: balance,
    };
  }

  async getBalanceByUserIdHandler(request) {
    const { userId } = request.params;

    const balance = await this._balancesService.getBalanceByUserId(userId);

    return {
      status: true,
      result: {
        balance,
      },
    };
  }

  async getUserProfileHandler(request) {
    const { id } = request.auth.credentials;
    const user = await this._service.getUserById(id);
    return {
      status: true,
      result: user,
    };
  }

  async putUsernameByAuth(request) {
    const { id } = request.auth.credentials;
    const user = await this._service.getUserById(id);
    const { username } = request.payload;

    await this._service.verifyNewUsername(username);
    const updatedUser = await this._service.changeUsername(username, user.id);

    return {
      status: true,
      result: updatedUser,
    };
  }

  // Super Admin handler Methods
  // GET ALL USERS
  async getAllUsersHandler(request, h) {
    try {
      this._validator.validateUserQuery(request.query);

      const { page = 1, limit = 10, filter } = request.query;

      const result = await this._service.getAllUsers(Number(page), Number(limit), {
        page,
        limit,
        filter,
      });

      return {
        status: true,
        ...result,
      };
    } catch (error) {
      return h
        .response({
          status: 'fail',
          message: error.message,
        })
        .code(400);
    }
  }

  // // GET USER BY ID
  // async getUserByIdHandler(request, h) {
  //   try {
  //     this._validator.validateUserParams(request.params);

  //     const { id } = request.params;
  //     const user = await this._service.getUserById(id);

  //     return {
  //       status: 'success',
  //       message: 'User data retrieved',
  //       result: user,
  //     };
  //   } catch (error) {
  //     return h
  //       .response({
  //         status: 'fail',
  //         message: error.message || 'Failed to get user',
  //       })
  //       .code(404);
  //   }
  // }

  // ✅ PATCH /users/:id
  async updateUserByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { payload } = request;

      await this._service.updateUserById(id, payload);

      return h
        .response({
          status: true,
          message: 'User berhasil diperbarui',
        })
        .code(200);
    } catch (error) {
      console.error('❌ Failed to update user:', error);
      throw error;
    }
  }

  // DELETE USER
  async deleteUserByIdHandler(request, h) {
    try {
      this._validator.validateUserParams(request.params);

      const { id } = request.params;
      const result = await this._service.deleteUserById(id);

      return h
        .response({
          status: true,
          message: 'User berhasil dihapus',
          data: result,
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: 'fail',
          message: error.message,
        })
        .code(400);
    }
  }

  async addUserByRoleHandler(request, h) {
    try {
      this._validator.validateUserCreatePayload(request.payload);
      this._validator.validateRoleParam(request.params);

      const { role } = request.params;

      const userId = await this._service.addUserByRoleTitle(role, request.payload);

      return h
        .response({
          status: true,
          message: `User berhasil ditambahkan (role: ${role})`,
          data: { userId },
        })
        .code(201);
    } catch (error) {
      return h
        .response({
          status: 'fail',
          message: error.message,
        })
        .code(400);
    }
  }
}

module.exports = UsersHandler;
