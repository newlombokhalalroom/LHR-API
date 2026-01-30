const autoBind = require('auto-bind');

class FacilitiesHandler {
  constructor(facilitiesService, typesService, facilitiesValidator) {
    this._facilitiesService = facilitiesService;
    this._typesService = typesService;
    this._facilitiesValidator = facilitiesValidator;

    autoBind(this);
  }

  async postFacilityHandler(request, h) {
    this._facilitiesValidator.validateFacilitiesPayload(request.payload);

    const { type, title, category } = request.payload;
    await this._facilitiesService.verifyNewFacility(title);

    const typeId = await this._typesService.getClientTypeId(type);
    const id = await this._facilitiesService.addFacility(typeId, { title, category });

    const response = h.response({
      status: true,
      message: 'Facility added successfully',
      result: {
        id,
      },
    });
    response.code(201);
    return response;
  }

  async getFacilitiesHandler(request) {
    const facilities = await this._facilitiesService.getAllFacilities(request.query);
    return {
      status: true,
      result: {
        facilities,
      },
    };
  }

  async putFacilityHandler(request) {
    this._facilitiesValidator.validateFacilitiesPayload(request.payload);

    const { id } = request.params;
    const { payload } = request;

    // Cek title duplikat hanya jika title diubah
    if ('title' in payload) {
      const { title } = await this._facilitiesService.getFacilityById(id);
      if (title !== payload.title) {
        await this._facilitiesService.verifyNewFacility(payload.title);
      }
    }

    // Jika type ada di payload, resolve ke typeId
    let typeId;
    if ('type' in payload) {
      typeId = await this._typesService.getClientTypeId(payload.type);
    }

    await this._facilitiesService.updateFacilityById(id, payload, typeId);

    return {
      status: true,
      message: 'Facility updated successfully',
    };
  }

  async deleteFacilityHandler(request) {
    const { id } = request.params;
    await this._facilitiesService.deleteFacilityById(id);

    return {
      status: true,
      message: 'Facility deleted successfully',
    };
  }
}

module.exports = FacilitiesHandler;
