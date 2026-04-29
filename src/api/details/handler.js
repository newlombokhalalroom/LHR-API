const autoBind = require('auto-bind');
const InvariantError = require('../../exceptions/InvariantError');

class DetailsHandler {
  constructor(detailsService, detailCategoriesService, typesService, detailsValidator) {
    this._detailsService = detailsService;
    this._detailCategoriesService = detailCategoriesService;
    this._typesService = typesService;
    this._detailsValidator = detailsValidator;

    autoBind(this);
  }

  // update
  async getDetailsProduct(request) {
    const { category, type } = request.query;

    let categoryId;
    if (category) {
      categoryId = await this._detailCategoriesService.getDetailCategoriesIdByTitle(category);
    }

    let typeId;
    if (type) {
      typeId = await this._typesService.getClientTypeId(type);
    }

    const details = await this._detailsService.getDetails(categoryId, typeId);

    return {
      status: true,
      result: details,
    };
  }

  // last

  async postDetailProduct(request, h) {
    this._detailsValidator.validatePostDetailsPayload(request.payload);

    const categoryId = await this._detailCategoriesService.getDetailCategoriesIdByTitle(
      request.payload.category,
    );
    const { title, type } = request.payload;
    const typeId = await this._typesService.getClientTypeId(type);
    await this._detailsService.verifyNewDetail(title);

    const addedDetail = await this._detailsService.addDetail(categoryId, title, typeId);

    const response = h.response({
      status: true,
      message: 'Detail added successfully',
      result: addedDetail,
    });
    response.code(201);
    return response;
  }

  async postDetailCategoriesHandler(request, h) {
    this._detailsValidator.validateDetailCategoriesPayload(request.payload);
    const { title } = request.payload;
    await this._detailCategoriesService.verifyNewDetailCategories(title);
    const id = await this._detailCategoriesService.addDetailCategories(title);

    const response = h.response({
      status: true,
      message: 'Detail category added successfully',
      result: {
        id,
      },
    });
    response.code(201);
    return response;
  }

  async putDetailCategoriesHandler(request) {
    this._detailsValidator.validateDetailCategoriesParams(request.params);
    this._detailsValidator.validateDetailCategoriesPayload(request.payload);
    const { id } = request.params;
    const { title } = request.payload;
    const currentTitle = await this._detailCategoriesService.getDetailCategoriesTitleById(id);
    if (currentTitle !== title) {
      await this._detailCategoriesService.verifyNewDetailCategories(title);
      const updatedDetailCategories = await this._detailCategoriesService.updateDetailCategory(
        id,
        request.payload,
      );
      return {
        status: true,
        message: 'Detail categories updated successfully',
        result: updatedDetailCategories,
      };
    }
    return new InvariantError(`This detail category title is already set as '${title}'`);
  }

  async deleteDetailCategoriesHandler(request) {
    this._detailsValidator.validateDetailCategoriesParams(request.params);
    const { id } = request.params;

    await this._detailCategoriesService.deleteDetailCategory(id);
    return {
      status: true,
      message: 'Detail categories deleted successfully',
    };
  }

  async putDetailHandler(request, h) {
    this._detailsValidator.validateDetailCategoriesParams(request.params);
    this._detailsValidator.validateUpdateDetailPayload(request.payload);

    const { id } = request.params;
    const { payload } = request;

    if ('title' in payload) {
      await this._detailsService.verifyNewDetail(payload.title);
    }

    let typeId = null;
    if ('type' in payload) {
      typeId = await this._typesService.getClientTypeId(payload.type);
    }

    let categoryId = null;
    if ('category' in payload) {
      categoryId = await this._detailCategoriesService.getDetailCategoriesIdByTitle(
        payload.category,
      );
    }

    const updatedDetail = await this._detailsService.updateDetailById(id, {
      title: payload.title,
      type_id: typeId,
      category_id: categoryId,
    });

    return h
      .response({
        status: true,
        message: 'Detail updated successfully',
        result: updatedDetail,
      })
      .code(200);
  }

  async getAllDetailsHandler(request, h) {
    const details = await this._detailsService.getAllDetails();

    return h
      .response({
        status: 'success',
        data: {
          details,
        },
      })
      .code(200);
  }

  async deleteDetailHandler(request, h) {
    // reuse validator params yang sama seperti PUT (id di params)
    this._detailsValidator.validateDetailCategoriesParams(request.params);
    const { id } = request.params;

    await this._detailsService.deleteDetailById(id);

    return h
      .response({
        status: true,
        message: 'Detail deleted successfully',
      })
      .code(200);
  }

  async getAllDetailCategoriesHandler(request, h) {
    const categories = await this._detailCategoriesService.getAllDetailCategories();

    return h
      .response({
        status: 'success',
        data: {
          categories,
        },
      })
      .code(200);
  }
}

module.exports = DetailsHandler;
