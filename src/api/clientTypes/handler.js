const autoBind = require('auto-bind');

class ClientTypesHandler {
  constructor(clientTypesService, clientTypesValidator) {
    this._clientTypesService = clientTypesService;
    this._clientTypesValidator = clientTypesValidator;

    autoBind(this);
  }

  async postClientTypeHandler(request, h) {
    this._clientTypesValidator.validateClientTypesPayload(request.payload);
    const { title, description } = request.payload;
    const { id, title: clientType } = await this._clientTypesService.addClientType(
      title,
      description,
    );
    const response = h.response({
      status: true,
      message: 'Client type added successfully',
      result: {
        id,
        clientType,
      },
    });
    response.code(201);
    return response;
  }
  async getAllClientTypesHandler(request, h) {
    const { title } = request.query;
    const types = await this._clientTypesService.getAllClientType(title);

    return h
      .response({
        status: true,
        result: types,
      })
      .code(200);
  }
  async updateClientTypeHandler(request, h) {
    const { id } = request.params;
    const { title, description } = request.payload;

    const updated = await this._clientTypesService.updateClientType(id, { title, description });

    return h
      .response({
        status: true,
        message: 'Client type updated successfully',
        result: updated,
      })
      .code(200);
  }
  async deleteClientTypeHandler(request, h) {
    const { id } = request.params;

    await this._clientTypesService.deleteClientType(id);

    return h
      .response({
        status: true,
        message: 'Client type deleted successfully',
      })
      .code(200);
  }
}

module.exports = ClientTypesHandler;
