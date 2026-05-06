const autoBind = require('auto-bind');

class ClientsHandler {
  constructor(
    clientsService,
    clientTypesService,
    clientsValidator,
    clientPicturesService,
    clientsFacilitiesService,
    locationsService,
    policiesService,
    clientsPoliciesService,
    productsService,
    productPicturesService,
    productItemsService,
    ProductsValidator,
  ) {
    this._clientsService = clientsService;
    this._clientTypesService = clientTypesService;
    this._clientsValidator = clientsValidator;
    this._clientPicturesService = clientPicturesService;
    this._clientsFacilitiesService = clientsFacilitiesService;
    this._locationsService = locationsService;
    this._policiesService = policiesService;
    this._clientsPoliciesService = clientsPoliciesService;
    this._productsService = productsService;
    this._productPicturesService = productPicturesService;
    this._productItemsService = productItemsService;
    this._productsValidator = ProductsValidator;

    autoBind(this);
  }

  // update
  async getClientProductsHandler(request) {
    this._productsValidator.validateGetClientProductsParams(request.params);
    await this._clientsService.getClientById(request.params.id);

    const products = await this._productsService.getProductsByClientId(
      request.params.id,
      request.query,
    );

    return {
      status: true,
      ...(products || {}),
    };
  }

  async getAllClientsWithUnapprovedHandler(request) {
    const clients = await this._clientsService.getAllClientsWithUnapproved(request.query);
    return {
      status: true,
      ...(clients || {}),
    };
  }

  async getClientsByIdWithDetailsHandler(request) {
    const _clients = await this._productsService.getProductsByClientId(request.params.id);
    // console.log(_clients);
    return {
      status: true,
      ...(_clients || {}),
    };
  }

  async getAllClientsHandler(request) {
    this._clientsValidator.validateGetAllClientsQuery(request.query);
    const { page, limit } = request.query;
    const clients = await this._clientsService.getAllClients(page, limit, request.query);
    return {
      status: true,
      ...(clients || {}),
    };
  }

  async getAllClientsApprovedHandler() {
    const clients = await this._clientsService.getAllClientsApproved();
    const clientsWithOneProduct = await Promise.all(
      clients.map(async (_client) => {
        const _product = await this._productsService.getProductsByClientId(_client.id);
        return {
          ..._client,
          product: _product?.result?.[0],
        };
      }),
    );
    // console.log(clientsWithOneProduct);
    return {
      status: true,
      result: clientsWithOneProduct,
    };
  }

  async getClientTypes(request) {
    const clientTypes = await this._clientTypesService.getAllClientType(request?.query?.type);
    return {
      status: true,
      result: clientTypes,
    };
  }

  // last

  async postClientsHandler(request, h) {
    this._clientsValidator.validateClientPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;

    await this._clientsService.verifyNewClientOwner(credentialId);
    await this._clientsService.verifyNewClientName(request.payload.name);

    const typeId = await this._clientTypesService.getClientTypeId(request.payload.type);
    const clientId = await this._clientsService.addClient(credentialId, typeId, request.payload);
    return h
      .response({
        status: true,
        message: 'client added successfully',
        result: {
          clientId,
        },
      })
      .code(201);
  }

  async putClientHandler(request, h) {
    this._clientsValidator.validateClientPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const clientCurrentName = await this._clientsService.getClientNameByOwnerId(credentialId);

    if (clientCurrentName !== request.payload.name) {
      await this._clientsService.verifyNewClientName(request.payload.name);
    }

    if (request.payload.type) {
      request.payload.type = await this._clientTypesService.getClientTypeId(request.payload.type);
    }

    const updatedClient = await this._clientsService.updateClient(
      credentialId,
      request.payload.type,
      request.payload,
    );
    const response = h.response({
      status: true,
      message: 'Clients updated successfully',
      result: {
        updatedClient,
      },
    });
    return response;
  }

  async getUnapprovedClientsHandler() {
    const clients = await this._clientsService.getUnapprovedClients();
    return {
      status: true,
      result: {
        clients,
      },
    };
  }

  async getClientsByUser(request) {
    const { id: credentialId } = request.auth.credentials;
    const client = await this._clientsService.getClientByOwnerId(credentialId);
    return {
      status: true,
      result: client,
    };
  }

  async getClientsByIdHandler(request) {
    // console.log('okay', request.params);
    this._clientsValidator.validateClientParams(request.params);
    const client = await this._clientsService.getClientById(request.params.id);
    const clientPictures = await this._clientPicturesService.getClientPicturesByClientId(client.id);
    const clientFacilities = await this._clientsFacilitiesService.getClientsFacilitiesByClientId(
      client.id,
    );
    const clientLocation = await this._locationsService.getLocationByClientId(client.id);
    const policies = await this._clientsPoliciesService.getClientPoliciesByClientId(client.id);

    return {
      status: true,
      result: {
        ...client,
        clientPictures,
        clientFacilities,
        clientLocation,
        policies,
      },
    };
  }

  async putClientApprovalHandler(request) {
    this._clientsValidator.validateClientParams(request.params);
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._clientsService.putClientApproval(credentialId, id);
    return {
      status: true,
      message: 'Client has been approved successfully',
    };
  }

  async postClientPicturesHandler(request, h) {
    this._clientsValidator.validateClientPictures(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const pictureId = await this._clientPicturesService.addClientPictures(
      clientId,
      request.payload,
    );
    const response = h.response({
      status: true,
      result: {
        pictureId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteClientPicturesHandler(request) {
    this._clientsValidator.validateClientDeletePictures(request.payload);
    const { id: credentialId } = request.auth.credentials;

    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: pictureId } = request.payload;
    const deletedPicture = await this._clientPicturesService.deleteClientPicturesById(
      pictureId,
      clientId,
    );

    return {
      status: true,
      message: `Picture of ${deletedPicture} is deleted successfully`,
    };
  }

  async postClientLocationHandler(request, h) {
    this._clientsValidator.validateClientLocation(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const locationId = await this._locationsService.addLocations(clientId, request.payload);
    const response = h.response({
      status: true,
      result: {
        locationId,
      },
    });
    response.code(201);
    return response;
  }

  async putClientLocationHandler(request, h) {
    this._clientsValidator.validateClientLocation(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const updatedLocation = await this._locationsService.updateLocation(clientId, request.payload);
    const response = h.response({
      status: true,
      message: 'Location updated successfully',
      result: updatedLocation,
    });
    return response;
  }

  async postClientPoliciesHandler(request, h) {
    this._clientsValidator.validateClientPolicies(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const client = await this._clientsService.getClientById(clientId);
    const typeId = client.type_id;

    const { policies } = request.payload;
    const policyTitles = policies.map((obj) => obj.title);

    let policyIds = [];
    try {
      policyIds = await this._policiesService.getPolicyIdsByTitles(policyTitles);
    } catch (error) {
      // Jika tidak ada sama sekali yang ditemukan, kita abaikan errornya agar bisa dibuat otomatis
      if (error.name !== 'NotFoundError') throw error;
    }

    // Auto-create missing policies (Pencocokan case-insensitive)
    const foundTitles = policyIds.map((p) => p.title.toLowerCase());
    const missingPolicies = policies.filter((p) => !foundTitles.includes(p.title.toLowerCase()));

    const newPolicies = await Promise.all(
      missingPolicies.map((missing) => this._policiesService.addPolicy(typeId, {
        title: missing.title,
        category: 'regular',
        description: missing.details || missing.title,
      })),
    );

    newPolicies.forEach((newPolicy) => {
      policyIds.push({ id: newPolicy.id, title: newPolicy.title });
    });

    const clientPolicies = policyIds.map((policy) => {
      const match = policies.find((obj) => obj.title.toLowerCase() === policy.title.toLowerCase());
      return {
        id: policy.id,
        details: match ? match.details : 0,
      };
    });

    const addedPolicies = await this._clientsPoliciesService.addClientPolicies(
      clientId,
      clientPolicies,
    );

    const response = h.response({
      status: true,
      message: "Client's policies added successfully",
      result: {
        policies: addedPolicies,
      },
    });
    response.code(201);
    return response;
  }

  async putClientPolicyHandler(request) {
    const { policyId } = request.params;
    this._clientsValidator.validateUUIDParams({ id: policyId });
    this._clientsValidator.validateUpdatePolicyPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    const { details } = request.payload;

    const updatedPolicy = await this._clientsPoliciesService.updateClientPolicy(
      clientId,
      policyId,
      details,
    );

    return {
      status: true,
      message: "Client's policy updated successfully",
      result: {
        clientId,
        updatedPolicy,
      },
    };
  }

  async deleteClientPolicyHandler(request) {
    const { policyId } = request.params;
    this._clientsValidator.validateUUIDParams({ id: policyId });

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    const deletedPolicy = await this._clientsPoliciesService.deleteClientPolicy(clientId, policyId);

    return {
      status: true,
      message: "Client's policy deleted successfully",
      result: {
        deletedPolicy,
      },
    };
  }
}

module.exports = ClientsHandler;
