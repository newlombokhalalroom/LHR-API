const autoBind = require('auto-bind');

class AdvertisementsHandler {
  constructor(advertisementsService, validator) {
    this._service = advertisementsService;
    this._validator = validator;
    autoBind(this);
  }

  async postAdvertisementHandler(request, h) {
    this._validator.validateAdvertisementPayload(request.payload);
    await this._service.verifyNewAdvertisement(request.payload);
    const advertisement = await this._service.addAdvertisement(request.payload);

    return h
      .response({
        status: true,
        message: 'Advertisement created successfully',
        data: advertisement,
      })
      .code(201);
  }

  async getAllAdvertisementsHandler(request) {
    const { type, status } = request.query;
    const result = await this._service.getAllAdvertisements(type, status, request.query);

    return {
      status: true,
      ...result,
    };
  }

  async getAdvertisementByIdHandler(request) {
    const { id } = request.params;
    const advertisement = await this._service.getAdvertisementById(id);

    return {
      status: true,
      data: advertisement,
    };
  }

  async putAdvertisementByIdHandler(request) {
    this._validator.validateUpdateAdvertisementPayload(request.payload);
    const { id } = request.params;

    const updated = await this._service.updateAdvertisementById(id, request.payload);

    return {
      status: true,
      message: 'Advertisement updated successfully',
      data: updated,
    };
  }

  async deleteAdvertisementByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAdvertisementById(id);

    return {
      status: true,
      message: 'Advertisement deleted successfully',
    };
  }
}

module.exports = AdvertisementsHandler;
