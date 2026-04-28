/* eslint-disable class-methods-use-this */
const autoBind = require('auto-bind');

class RolesHandler {
  constructor(rolesService, rolesValidator) {
    this._rolesService = rolesService;
    this._rolesValidator = rolesValidator;

    autoBind(this);
  }

  async postRolesHandler(request, h) {
    this._rolesValidator.validateUserRolesPayload(request.payload);
    const { title, description } = request.payload;
    const { id, title: role } = await this._rolesService.addRole(title, description);
    const response = h.response({
      status: true,
      message: 'Role added successfully',
      result: {
        id,
        role,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = RolesHandler;
