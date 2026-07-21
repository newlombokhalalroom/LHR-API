const autoBind = require('auto-bind');

class PartnerHotelsHandler {
  constructor(service, validator, clientsService) {
    this._service = service;
    this._validator = validator;
    this._clientsService = clientsService;

    autoBind(this);
  }

  async postPartnerHotelHandler(request, h) {
    this._validator.validatePartnerHotelPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    const partnerHotelId = await this._service.addPartnerHotel({
      ...request.payload,
      clientId,
    });

    return h.response({
      status: true,
      message: 'Partner Hotel added successfully',
      result: { id: partnerHotelId },
    }).code(201);
  }

  async getPartnerHotelsByClientIdHandler(request) {
    const { id: clientId } = request.params;
    const hotels = await this._service.getPartnerHotelsByClientId(clientId);
    return {
      status: true,
      result: hotels,
    };
  }

  async getMyPartnerHotelsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    
    const hotels = await this._service.getPartnerHotelsByClientId(clientId);
    return {
      status: true,
      result: hotels,
    };
  }

  async getPartnerHotelByIdHandler(request) {
    const { id: hotelId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    await this._service.verifyPartnerHotelOwner(hotelId, clientId);
    const hotel = await this._service.getPartnerHotelById(hotelId);

    return {
      status: true,
      result: hotel,
    };
  }

  async putPartnerHotelByIdHandler(request) {
    this._validator.validatePartnerHotelPayload(request.payload);
    const { id: hotelId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    await this._service.verifyPartnerHotelOwner(hotelId, clientId);
    await this._service.updatePartnerHotelById(hotelId, request.payload);

    return {
      status: true,
      message: 'Partner Hotel updated successfully',
    };
  }

  async deletePartnerHotelByIdHandler(request) {
    const { id: hotelId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    await this._service.verifyPartnerHotelOwner(hotelId, clientId);
    await this._service.deletePartnerHotelById(hotelId);

    return {
      status: true,
      message: 'Partner Hotel deleted successfully',
    };
  }
}

module.exports = PartnerHotelsHandler;
