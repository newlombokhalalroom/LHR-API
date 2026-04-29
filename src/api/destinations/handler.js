const autoBind = require('auto-bind');

class DestinationsHandler {
  constructor(DestinationsValidator, destinationsService, destinationPicturesService) {
    this._DestinationsValidator = DestinationsValidator;
    this._destinationsService = destinationsService;
    this._destinationPicturesService = destinationPicturesService;
    autoBind(this);
  }

  async postDestinationHandler(request, h) {
    this._DestinationsValidator.validatePostDestinationPayload(request.payload);
    const { pictures, ...destination } = request.payload;
    const addedDestination = await this._destinationsService.addDestination(destination);
    const addedPictures = await this._destinationPicturesService.addDestinationPictures(
      addedDestination.id,
      pictures,
    );
    const response = h.response({
      status: true,
      message: 'Destination added successfully',
      result: {
        ...addedDestination,
        pictures: addedPictures,
      },
    });
    response.code(201);
    return response;
  }

  async getDestinationHandlerById(request) {
    this._DestinationsValidator.validateUUIDParams(request.params);
    const destination = await this._destinationsService.getDestinationById(request.params.id);
    return {
      status: true,
      result: destination,
    };
  }

  async getDestinationsHandler(request) {
    this._DestinationsValidator.validateGetDestinationsQuery(request.query);
    const destinations = await this._destinationsService.getDestinations(request.query);
    return {
      status: true,
      result: destinations,
    };
  }

  async getDestinationCategoriesHandler() {
    const categories = await this._destinationsService.getCategories();
    return {
      status: true,
      result: categories,
    };
  }

  async getAllDestinationsHandler(request) {
    const result = await this._destinationsService.getAllDestinations(request.query);
    return {
      status: true,
      ...result,
    };
  }

  async updateDestinationHandler(request, h) {
    this._DestinationsValidator.validateUUIDParams(request.params);
    const { id } = request.params;

    const updated = await this._destinationsService.updateDestination(id, request.payload);

    return h
      .response({
        status: true,
        message: 'Destination updated successfully',
        result: updated,
      })
      .code(200);
  }

  async deleteDestinationHandler(request, h) {
    this._DestinationsValidator.validateUUIDParams(request.params);
    const { id } = request.params;

    await this._destinationsService.deleteDestination(id);

    return h
      .response({
        status: true,
        message: 'Destination deleted successfully',
      })
      .code(200);
  }
}

module.exports = DestinationsHandler;
