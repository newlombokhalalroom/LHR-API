const autoBind = require('auto-bind');

class PoliciesHandler {
  constructor(policiesService, typesService, policiesValidator) {
    this._policiesService = policiesService;
    this._typesService = typesService;
    this._policiesValidator = policiesValidator;

    autoBind(this);
  }

  async postPolicyHandler(request, h) {
    this._policiesValidator.validatePoliciesPayload(request.payload);
    const { type, title } = request.payload;

    await this._policiesService.verifyNewPolicy(title);
    const typeId = await this._typesService.getClientTypeId(type);

    const policy = await this._policiesService.addPolicy(typeId, request.payload);

    const response = h.response({
      status: true,
      message: 'Policy added successfully',
      result: {
        policy,
      },
    });
    response.code(201);
    return response;
  }

  async getPoliciesHandler(request) {
    const { category, type } = request.query;

    let typeId;
    if (type) {
      typeId = await this._typesService.getClientTypeId(type);
    }

    const result = await this._policiesService.getPolicies(category, typeId);
    return {
      status: true,
      result,
    };
  }

  async deletePolicyHandler(request, h) {
    this._policiesValidator.validatePolicyParams(request.params);
    const { id } = request.params;

    await this._policiesService.deletePolicy(id);

    const response = h.response({
      status: true,
      message: 'Policy deleted successfully',
    });
    response.code(200);
    return response;
  }

  async updatePolicyHandler(request, h) {
    this._policiesValidator.validatePolicyParams(request.params);
    this._policiesValidator.validateUpdatePoliciesPayload(request.payload);

    const { id } = request.params;
    const updatedPolicy = await this._policiesService.updatePolicy(id, request.payload);

    return h
      .response({
        status: true,
        message: 'Policy updated successfully',
        data: updatedPolicy,
      })
      .code(200);
  }
}

module.exports = PoliciesHandler;
