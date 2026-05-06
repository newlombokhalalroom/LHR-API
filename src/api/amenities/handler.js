const autoBind = require('auto-bind');

class AmenitiesHandler {
  constructor(amenitiesService, AmenitiesValidator, typesService) {
    this._amenitiesService = amenitiesService;
    this._amenitiesValidator = AmenitiesValidator;
    this._typesService = typesService;

    autoBind(this);
  }

  async getAmenitiesHandler(request) {
    const { type, category, ...rest } = request.query;
    const amenities = await this._amenitiesService.getAllAmenities(type, category, rest);
    return {
      status: true,
      ...(amenities || {}),
    };
  }

  async postAmenityHandler(request, h) {
    this._amenitiesValidator.validateAmenitiesPayload(request.payload);
    await this._amenitiesService.verifyNewAmenity(request.payload);
    const typeId = await this._typesService.getClientTypeId(request.payload.type);
    const amenity = await this._amenitiesService.addAmenity(typeId, request.payload);
    const response = h.response({
      status: true,
      message: 'Amenity added successfully',
      result: {
        amenity,
      },
    });
    response.code(201);
    return response;
  }

  async getAmenityHandler(request) {
    this._amenitiesValidator.validateAmenitiesIdParams(request.params);
    const amenity = await this._amenitiesService.getAmenityById(request.params.id);
    return {
      status: true,
      result: {
        amenity,
      },
    };
  }

  async updateAmenityHandler(request) {
    this._amenitiesValidator.validateAmenitiesIdParams(request.params);
    this._amenitiesValidator.validateUpdateAmenitiesPayload(request.payload);

    const { id } = request.params;
    const { payload } = request;

    if ('title' in payload) {
      const { title } = await this._amenitiesService.getAmenityById(id);
      if (title !== payload.title) {
        await this._amenitiesService.verifyNewAmenity(payload.title);
      }
    }

    let typeId = null;
    if ('type' in payload) {
      typeId = await this._typesService.getClientTypeId(payload.type);
    }

    const amenity = await this._amenitiesService.updateAmenityById(id, payload, typeId);

    return {
      status: true,
      message: 'Amenity updated successfully',
      result: amenity,
    };
  }

  async deleteAmenityHandler(request) {
    this._amenitiesValidator.validateAmenitiesIdParams(request.params);
    const amenityId = await this._amenitiesService.deleteAmenityById(request.params.id);
    return {
      status: true,
      message: 'Amenity deleted successfully',
      result: {
        amenityId,
      },
    };
  }
}

module.exports = AmenitiesHandler;
