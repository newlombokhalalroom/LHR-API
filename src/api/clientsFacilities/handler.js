const autoBind = require('auto-bind');

class ClientsFacilitesHandler {
  constructor(
    clientsFacilitiesService,
    clientsService,
    facilitiesService,
    clientsFacilitiesValidator,
  ) {
    this._clientsFacilitiesService = clientsFacilitiesService;
    this._clientsService = clientsService;
    this._facilitiesService = facilitiesService;
    this._clientsFacilitiesValidator = clientsFacilitiesValidator;

    autoBind(this);
  }

  async postClientsFacilities(request, h) {
    this._clientsFacilitiesValidator.validateClientsFacilitiesPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    const { facilities } = request.payload;

    const facilitiesId = await this._facilitiesService.getFacilityIdByTitle(facilities);
    const arrayOfFacilitiesId = facilitiesId.map((obj) => obj.id);

    const result = await this._clientsFacilitiesService.addClientsFacilities(
      clientId,
      arrayOfFacilitiesId,
    );

    const response = h.response({
      status: true,
      message: 'Facilities added successfully',
      result,
    });
    response.code(201);
    return response;
  }

  async deleteClientsFaclities(request) {
    this._clientsFacilitiesValidator.validateClientsDeleteFacilitiesPayload(request.payload);

    const { id: credentialId } = await request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    const { facility } = request.payload;
    const facilityId = await this._facilitiesService.getFacilityIdByTitle([facility]);
    await this._clientsFacilitiesService.deleteClientsFacilities(clientId, facilityId[0].id);

    return {
      status: true,
      message: 'Facility has been deleted',
    };
  }
}

module.exports = ClientsFacilitesHandler;
