const autoBind = require('auto-bind');

class OptionsHandler {
  constructor(OptionsValidator, clientTypesService, optionsService) {
    this._OptionsValidator = OptionsValidator;
    this._clientTypesService = clientTypesService;
    this._optionsService = optionsService;

    autoBind(this);
  }

  async postOptionHandler(request, h) {
    this._OptionsValidator.validatePostOptionPayload(request.payload);
    await this._optionsService.verifyNewOption(request.payload.title, request.payload.category);
    const typeId = await this._clientTypesService.getClientTypeId(request.payload.type);
    const option = await this._optionsService.addOption(typeId, request.payload);
    const response = h.response({
      status: true,
      message: 'Option added successfully',
      result: {
        option,
      },
    });
    response.code(201);
    return response;
  }

  async putOptionHandler(request) {
    this._OptionsValidator.validateUUIDParams({ id: request.params.optionId });
    this._OptionsValidator.validatePostOptionPayload(request.payload);

    const { optionId } = request.params;
    const { title } = await this._optionsService.getOptionById(optionId);

    if (title !== request.payload.title) {
      await this._optionsService.verifyNewOption(request.payload.title, request.payload.category);
    }

    const typeId = await this._clientTypesService.getClientTypeId(request.payload.type);
    const option = await this._optionsService.updateOptionById(optionId, typeId, request.payload);
    return {
      status: true,
      message: 'Option updated successfully',
      result: {
        option,
      },
    };
  }

  async deleteOptionHandler(request) {
    this._OptionsValidator.validateUUIDParams({ id: request.params.optionId });
    const { optionId } = request.params;

    await this._optionsService.deleteOptionById(optionId);

    return {
      status: true,
      message: 'Option deleted successfully',
    };
  }

  async getOptionsHandler(request, h) {
    const { category, type } = request.query;

    let typeId;
    if (type) {
      typeId = await this._clientTypesService.getClientTypeId(type);
    }

    const options = await this._optionsService.getOptions(category, typeId);

    return h
      .response({
        status: true,
        result: options,
      })
      .code(200);
  }
}

module.exports = OptionsHandler;
