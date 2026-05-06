const autoBind = require('auto-bind');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class ProductsHandler {
  constructor(
    productsService,
    amenitiesService,
    clientsService,
    productPicturesService,
    detailsService,
    productsDetailsService,
    productsAmenitiesService,
    productsValidator,
    productItemsService,
    unavailableStatusService,
    optionsService,
    productsOptionsService,
    productsPoliciesService,
    policiesService,
    reviewsService,
  ) {
    this._productsService = productsService;
    this._amenitiesService = amenitiesService;
    this._clientsService = clientsService;
    this._productPicturesService = productPicturesService;
    this._detailsService = detailsService;
    this._productsDetailsService = productsDetailsService;
    this._productsAmenitiesService = productsAmenitiesService;
    this._productsValidator = productsValidator;
    this._productItemsService = productItemsService;
    this._unavailableStatusService = unavailableStatusService;
    this._optionsService = optionsService;
    this._productsOptionsService = productsOptionsService;
    this._productsPoliciesService = productsPoliciesService;
    this._policiesService = policiesService;
    this._reviewsService = reviewsService;

    autoBind(this);
  }

  // update
  async getProductsWithClientHandler(request) {
    const products = await this._productsService.getProducts(request.query);
    // console.log('resp', products);
    return {
      status: true,
      ...(products || {}),
    };
  }

  async getAllProductItemUnavailableByClientIdStatusHandler(request) {
    const itemUnavailableStatus = await this._unavailableStatusService.getUnavailableItems(
      request.query,
      request.params.clientId,
    );
    return {
      status: true,
      ...(itemUnavailableStatus || {}),
    };
  }

  async patchProductsHandler(request, h) {
    // remove validation of id not allowed
    this._productsValidator.validateProductsPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;

    const updatedProduct = await this._productsService.updateProductById(
      productId,
      request.payload,
    );

    const updateAmenities = await this._productsAmenitiesService.updateProductsAmenities(
      productId,
      request.payload.amenities?.map((_item) => _item.id),
    );

    const updatePictures = await this._productPicturesService.updateProductPictures(
      productId,
      request.payload.pictures,
    );

    const updateDetails = await this._productsDetailsService.updateProductDetail(
      productId,
      request.payload.details,
    );

    // console.log({
    //   ...updatedProduct,
    //   amenities: updateAmenities,
    //   pictures: updatePictures,
    //   details: updateDetails,
    // });

    return h
      .response({
        status: true,
        message: 'Product updated successfully',
        result: {
          ...updatedProduct,
          amenities: updateAmenities,
          // UPDATE US-03 - KISUL
          trip_detail: request.payload.trip_detail || null,
          itineraries: request.payload.itineraries || [],
          // pictures: productPictures,
          // details: productDetails,
        },
      })
      .code(201);
  }

  async postProductsHandler(request, h) {
    // remove validation of id not allowed
    this._productsValidator.validateProductsPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const amenitiesId =
      (!request.payload.amenities?.find((_item) => !_item.id) && request.payload.amenities) ||
      (await this._amenitiesService.getAmenityIdByTitle(request.payload.amenities));
    const arrayOfAmenitiesId = amenitiesId.map((obj) => obj.id);
    const productDetails = request.payload.details;
    const arrayOfDetailTitle = productDetails.map((obj) => obj.title);
    const detailsId = await this._detailsService.getDetailIdByTitle(arrayOfDetailTitle);
    const newDetailsData = detailsId.map((detail) => {
      const match = productDetails.find((product) => product.title === detail.title);
      return { id: detail.id, amount: match ? match.amount : 0 };
    });
    const product = await this._productsService.addProduct(clientId, request.payload);
    const productAmenities = await this._productsAmenitiesService.addProductsAmenities(
      product.id,
      arrayOfAmenitiesId,
    );
    const arrayOfProductAmenities = productAmenities.map((obj) => obj);
    const productPictures = await this._productPicturesService.addProductPictures(
      product.id,
      request.payload.pictures,
    );
    const arrayOfPicture = productPictures.map((obj) => obj);
    const productDetailsRes = await this._productsDetailsService.addProductDetail(
      product.id,
      newDetailsData,
    );
    const arrayOfDetails = productDetailsRes.map((obj) => obj);
    const response = h.response({
      status: true,
      message: 'Product added successfully',
      result: {
        ...product,
        amenities: arrayOfProductAmenities,
        pictures: arrayOfPicture,
        details: arrayOfDetails,
        // UPDATE US-03 - KISUL
        trip_detail: request.payload.trip_detail || null,
        itineraries: request.payload.itineraries || [],
      },
    });
    response.code(201);
    return response;
  }

  async getProductByIdHandler(request) {
    this._productsValidator.validateGetProductByIdParams(request.params);
    const { id } = request.params;
    const product = await this._productsService.getProductById(id);
    return {
      status: true,
      ...(product || {}),
    };
  }

  // async getProductItemHandler(request) {
  //   this._productsValidator.validateGetProductByIdParams(request.params);
  //   const { id } = request.params;
  //   const product = await this._productsService.getProductById(id);

  //   const product_items = await this._productItemsService.getProductItemsByProductId(id);
  //   return {
  //     status: true,
  //     result: {
  //       ...(product || {}),
  //       product_items,
  //     },
  //   };
  // }

  // last

  async putProductsHandler(request) {
    this._productsValidator.validatePutProductsPayload(request.payload);
    this._productsValidator.validatePutProductsParams(request.params);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;

    // const amenitiesId =
    //   (!request.payload.amenities?.find((_item) => !_item.id) && request.payload.amenities) ||
    //   (await this._amenitiesService.getAmenityIdByTitle(request.payload.amenities));
    // const arrayOfAmenitiesId = amenitiesId.map((obj) => obj.id);

    // const productDetails = request.payload.details;
    // const arrayOfDetailTitle = productDetails.map((obj) => obj.title);

    // const detailsId = await this._detailsService.getDetailIdByTitle(arrayOfDetailTitle);
    // const arrayOfDetailsId = detailsId.map((detail) => {
    //   const match = productDetails.find((product) => product.title === detail.title);
    //   return { id: detail.id, amount: match ? match.amount : 0 };
    // });

    await this._productsService.verifyClientAccess(productId, clientId);

    const updatedProduct = await this._productsService.updateProductById(
      productId,
      request.payload,
    );
    // const productAmenities = await this._productsAmenitiesService.addProductsAmenities(
    //   updatedProduct.id,
    //   arrayOfAmenitiesId,
    // );
    // const arrayOfProductAmenities = productAmenities.map((obj) => obj);
    // const productPictures = await this._productPicturesService.addProductPictures(
    //   updatedProduct.id,
    //   request.payload.pictures,
    // );
    // const arrayOfPicture = productPictures.map((obj) => obj);
    // const productDetailsRes = await this._productsDetailsService.addProductDetail(
    //   updatedProduct.id,
    //   newDetailsData,
    // );

    return {
      status: true,
      message: 'Product updated successfully',
      result: updatedProduct,
    };
  }

  async deleteProductHandler(request) {
    this._productsValidator.validateUUIDParams(request.params);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;

    // make sure the product is exists
    const {
      result: { client_id: ownerId },
    } = await this._productsService.getProductById(productId);

    // verify product access
    if (ownerId !== clientId) {
      throw new AuthorizationError('Forbidden access to this product');
    }

    const deletedProduct = await this._productsService.deleteProduct(productId);

    return {
      status: true,
      message: 'Product deleted successfully',
      result: deletedProduct,
    };
  }

  // last

  // async getProductByIdHandler(request) {
  //   this._productsValidator.validateGetProductByIdParams(request.params);
  //   const { id } = request.params;
  //   const product = await this._productsService.getProductById(id);
  //   const amenities = await this._productsAmenitiesService.getProductAmenitiesByProductId(
  //     product.id,
  //   );
  //   const pictures = await this._productPicturesService.getProductPicturesByProductId(product.id);
  //   const details = await this._productsDetailsService.getProductDetailsByProductId(product.id);
  //   const options = await this._productsOptionsService.getProductOptionsByProductId(product.id);
  //   return {
  //     status: true,
  //     result: {
  //       ...product,
  //       amenities,
  //       pictures,
  //       details,
  //       options,
  //     },
  //   };
  // }

  async postProductAmenitiesHandler(request, h) {
    this._productsValidator.validateProductsAmenitiesPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;
    await this._productsService.verifyClientAccess(productId, clientId);

    const amenitiesId = await this._amenitiesService.getAmenityIdByIds(request.payload.amenities);
    const arrayOfAmenitiesId = amenitiesId.map((obj) => obj.id);
    const productAmenities = await this._productsAmenitiesService.addProductsAmenities(
      productId,
      arrayOfAmenitiesId,
    );
    const arrayOfAddedAmenities = productAmenities.map((obj) => obj);
    const response = h.response({
      status: true,
      message: 'Product amenities added successfully',
      result: arrayOfAddedAmenities,
    });
    response.code(201);
    return response;
  }

  async postProductPicturesHandler(request, h) {
    this._productsValidator.validateProductsPicturesPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;
    await this._productsService.verifyClientAccess(productId, clientId);

    const productPictures = await this._productPicturesService.addProductPictures(
      productId,
      request.payload.pictures,
    );
    const arrayOfAddedPicture = productPictures.map((obj) => obj);
    const response = h.response({
      status: true,
      message: 'Product pictures added successfully',
      result: arrayOfAddedPicture,
    });
    response.code(201);
    return response;
  }

  // Product's Details
  async postProductDetailsHandler(request, h) {
    this._productsValidator.validateUUIDParams({ id: request.params.productId });
    this._productsValidator.validateProductsDetailsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;
    await this._productsService.verifyClientAccess(productId, clientId);

    const productDetails = request.payload.details;
    const arrayOfDetailTitle = productDetails.map((obj) => obj.title);
    const detailsId = await this._detailsService.getDetailIdByTitle(arrayOfDetailTitle);

    const newDetailsData = detailsId.map((detail) => {
      const match = productDetails.find((product) => product.title === detail.title);
      return { id: detail.id, amount: match ? match.amount : 0 };
    });

    const productDetailsRes = await this._productsDetailsService.addProductDetail(
      productId,
      newDetailsData,
    );

    const response = h.response({
      status: true,
      message: 'Product details added successfully',
      result: productDetailsRes,
    });
    response.code(201);
    return response;
  }

  async putProductDetailHandler(request) {
    this._productsValidator.validateDeleteProductDetailsParams({ id: request.params.productId });
    this._productsValidator.validateDeleteProductDetailsParams({ id: request.params.detailId });
    this._productsValidator.validateProductDetailUpdatePayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    const { productId, detailId } = request.params;
    const { amount } = request.payload;

    await this._productsService.verifyClientAccess(productId, clientId);

    const updatedProductDetails = await this._productsDetailsService.updateProductsDetails(
      amount,
      productId,
      detailId,
    );

    return {
      status: true,
      message: 'Product detail updated successfully',
      result: updatedProductDetails[0],
    };
  }

  async deleteProductDetailsHandler(request) {
    this._productsValidator.validateDeleteProductDetailsParams({ id: request.params.productId });
    this._productsValidator.validateDeleteProductDetailsParams({ id: request.params.detailId });
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { productId, detailId } = request.params;
    await this._productsService.verifyClientAccess(productId, clientId);
    const deletedDetail = await this._productsDetailsService.deleteProductsDetails(
      productId,
      detailId,
    );
    return {
      status: true,
      message: 'Product detail deleted successfully',
      result: deletedDetail[0],
    };
  }

  async deleteProductAmenitiesHandler(request) {
    this._productsValidator.validateDeleteProductAmenitiesParams({ id: request.params.productId });
    this._productsValidator.validateDeleteProductAmenitiesParams({ id: request.params.amenityId });
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { productId, amenityId } = request.params;

    await this._productsService.verifyClientAccess(productId, clientId);
    const deletedAmenities = await this._productsAmenitiesService.deleteProductsAmenities(
      productId,
      amenityId,
    );
    return {
      status: true,
      message: 'Products amenities deleted successfully',
      result: deletedAmenities,
    };
  }

  async deleteProductPicturesHandler(request) {
    this._productsValidator.validateDeleteProductPicturesParams({ id: request.params.productId });
    this._productsValidator.validateDeleteProductPicturesParams({ id: request.params.pictureId });
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { productId, pictureId } = request.params;
    await this._productsService.verifyClientAccess(productId, clientId);
    const deletedPicture = await this._productPicturesService.deleteProductPictures(pictureId);
    return {
      status: true,
      message: 'Product picture deleted successfully',
      result: deletedPicture,
    };
  }

  // Product's Item Handler
  async postProductItemHandler(request, h) {
    this._productsValidator.validateUUIDParams(request.params);
    this._productsValidator.validateProductItemPayload(request.payload);

    const { id: productId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    await this._productsService.verifyClientAccess(productId, clientId);

    const item = await this._productItemsService.addProductItem(productId, request.payload.title);

    const response = h.response({
      status: true,
      result: {
        item,
      },
    });
    response.code(201);
    return response;
  }

  async putProductItemHandler(request) {
    this._productsValidator.validateUUIDParams({ id: request.params.productId });
    this._productsValidator.validateUUIDParams({ id: request.params.itemId });
    this._productsValidator.validateProductItemPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { productId, itemId } = request.params;
    const { title } = request.payload;

    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    await this._productsService.verifyClientAccess(productId, clientId);

    const item = await this._productItemsService.putProductItem(itemId, productId, title);

    return {
      status: true,
      message: "Product's item updated successfully",
      result: {
        item,
      },
    };
  }

  async deleteProductItemHandler(request) {
    this._productsValidator.validateUUIDParams({ id: request.params.productId });
    this._productsValidator.validateUUIDParams({ id: request.params.itemId });

    const { id: credentialId } = request.auth.credentials;
    const { productId, itemId } = request.params;

    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    await this._productsService.verifyClientAccess(productId, clientId);

    const item = await this._productItemsService.deleteProductItem(itemId, productId);

    return {
      status: true,
      message: "Product's item deleted successfully",
      result: {
        item,
      },
    };
  }

  async getProductItemsHandler(request) {
    this._productsValidator.validateUUIDParams({ id: request.params.productId });

    const { id: credentialId } = request.auth.credentials;
    const { productId } = request.params;

    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    await this._productsService.verifyClientAccess(productId, clientId);

    // todo:unnecessary since its optional used by getProductItemsByProductId
    // if (Object.keys(request.query).length > 0) {
    //   this._productsValidator.validateProductItemAsUnavailablePayload(request.query);
    // }

    const { startDate, endDate } = request.query;

    const items = await this._productItemsService.getProductItemsByProductId(
      productId,
      startDate,
      endDate,
    );

    return {
      status: true,
      result: {
        productId,
        items,
      },
    };
  }

  async getProductItemByIdHandler(request) {
    this._productsValidator.validateUUIDParams({ id: request.params.productId });
    this._productsValidator.validateUUIDParams({ id: request.params.itemId });

    const { id: credentialId } = request.auth.credentials;
    const { productId, itemId } = request.params;

    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    await this._productsService.verifyClientAccess(productId, clientId);

    const item = await this._productItemsService.getProductItem(itemId, productId);
    const itemUnavailableStatus = await this._unavailableStatusService.getUnavailableStausByItemId(
      itemId,
    );

    return {
      status: true,
      result: {
        item: {
          ...item,
          unavailable: itemUnavailableStatus,
        },
      },
    };
  }

  async getProductsItemsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    if (Object.keys(request.query).length > 0) {
      this._productsValidator.validateProductItemAsUnavailablePayload(request.query);
    }

    const { startDate, endDate } = request.query;

    const items = await this._productItemsService.getProductItemsByClientId(
      clientId,
      startDate,
      endDate,
    );

    return {
      status: true,
      result: {
        items,
      },
    };
  }

  // Item's Unavailable Status Handler
  async postProductItemAsUnavailableHandler(request, h) {
    this._productsValidator.validateUUIDParams({ id: request.params.productId });
    this._productsValidator.validateUUIDParams({ id: request.params.itemId });
    this._productsValidator.validateProductItemAsUnavailablePayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { productId, itemId } = request.params;

    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    await this._productsService.verifyClientAccess(productId, clientId);
    await this._productItemsService.getProductItem(itemId, productId);

    await this._unavailableStatusService.verifyNewItemDates(itemId, request.payload);

    const unavailableStatus = await this._unavailableStatusService.addUnavailableStaus(
      itemId,
      request.payload,
    );

    const response = h.response({
      status: true,
      result: {
        item: {
          id: itemId,
          unavailable: unavailableStatus,
        },
      },
    });
    response.code(201);
    return response;
  }

  async getAllProductItemUnavailableStatusHandler(request) {
    const itemUnavailableStatus = await this._unavailableStatusService.getUnavailableItems(
      request.query,
    );
    return {
      status: true,
      ...(itemUnavailableStatus || {}),
    };
  }

  async getProductItemUnavailableStatusHandler(request) {
    this._productsValidator.validateUUIDParams({ id: request.params.productId });
    this._productsValidator.validateUUIDParams({ id: request.params.itemId });

    const { id: credentialId } = request.auth.credentials;
    const { productId, itemId } = request.params;

    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    await this._productsService.verifyClientAccess(productId, clientId);
    await this._productItemsService.getProductItem(itemId, productId);

    const itemUnavailableStatus = await this._unavailableStatusService.getUnavailableStausByItemId(
      itemId,
    );

    return {
      status: true,
      result: {
        item: {
          id: itemId,
          unavailable: itemUnavailableStatus,
        },
      },
    };
  }

  async deleteProductItemUnavailableStatusHandler(request) {
    this._productsValidator.validateUUIDParams({ id: request.params.productId });
    this._productsValidator.validateUUIDParams({ id: request.params.itemId });
    this._productsValidator.validateUUIDParams({ id: request.params.statusId });

    const { id: credentialId } = request.auth.credentials;
    const { productId, itemId } = request.params;

    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    await this._productsService.verifyClientAccess(productId, clientId);
    await this._productItemsService.getProductItem(itemId, productId);

    const statusId = await this._unavailableStatusService.deleteUnavailableStatus(
      request.params,
      itemId,
    );

    return {
      status: true,
      message: "Product item's unavailable status has been deleted",
      result: statusId,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  groupProducts(data) {
    const groupedProducts = {};

    data.forEach((product) => {
      const key = JSON.stringify({
        title: product.title,
        details: product.details,
      });

      if (!groupedProducts[key]) {
        groupedProducts[key] = {
          title: product.title,
          details: product.details,
          picture: '',
          startingPrice: Infinity,
          units: product.units,
          clients: [],
        };
      }

      const currentProduct = groupedProducts[key];

      if (parseFloat(product.price) < currentProduct.startingPrice) {
        [currentProduct.picture] = product.pictures.slice(0, 1);
        currentProduct.startingPrice = parseFloat(product.price);
      }

      if (!currentProduct.clients.includes(product.client_id)) {
        currentProduct.clients.push({
          productId: product.id,
          clientId: product.client_id,
          clientName: product.client.name,
          price: product.price,
        });
      }
    });

    return Object.values(groupedProducts);
  }

  async getCarsHandler(request) {
    this._productsValidator.validateGetCarsQuery(request.query);
    const options = {
      ...request.query,
      type: 'car rent',
    };
    const products = await this._productsService.getCars(options);

    // shitty grouping
    const result = this.groupProducts(products);

    return {
      status: true,
      result,
    };
  }

  async postProductPoliciesHandler(request, h) {
    this._productsValidator.validateProductPolicies(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;
    await this._productsPoliciesService.verifyClientAccess(productId, clientId);

    const { policies } = request.payload;
    const policyTitles = policies.map((obj) => obj.title);

    const policyIds = await this._policiesService.getPolicyIdsByTitles(policyTitles);

    const productPolicies = policyIds.map((policy) => {
      const match = policies.find((obj) => obj.title === policy.title);
      return {
        id: policy.id,
        details: match ? match.details : 0,
      };
    });

    const addedPolicies = await this._productsPoliciesService.addProductPolicies(
      productId,
      productPolicies,
    );

    const response = h.response({
      status: true,
      message: "Product's policies added successfully",
      result: {
        policies: addedPolicies,
      },
    });
    response.code(201);
    return response;
  }

  async putProductPolicyHandler(request) {
    const { policyId } = request.params;
    this._productsValidator.validateUUIDParams({ id: policyId });
    this._productsValidator.validateUpdatePolicyPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;
    await this._productsPoliciesService.verifyClientAccess(productId, clientId);

    const { details } = request.payload;

    const updatedPolicy = await this._productsPoliciesService.updateProductPolicy(
      productId,
      policyId,
      details,
    );

    return {
      status: true,
      message: "Product's policy updated successfully",
      result: {
        productId,
        updatedPolicy,
      },
    };
  }

  async deleteProductPolicyHandler(request) {
    const { policyId } = request.params;
    this._productsValidator.validateUUIDParams({ id: policyId });

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;
    await this._productsPoliciesService.verifyClientAccess(productId, clientId);

    const deletedPolicy = await this._productsPoliciesService.deleteProductPolicy(
      productId,
      policyId,
    );

    return {
      status: true,
      message: "Product's policy deleted successfully",
      result: {
        deletedPolicy,
      },
    };
  }

  async getProductReviews(request) {
    this._productsValidator.validateUUIDParams(request.params);
    this._productsValidator.validateGetReviewsQuery(request.query);

    const { id: productId } = request.params;
    const { sort, filter, page = 1, limit = 10 } = request.query;

    const reviews = await this._reviewsService.getReviewsByProductId(
      productId,
      sort,
      filter,
      page,
      limit,
    );

    return {
      status: true,
      result: {
        productId,
        sort,
        filter,
        reviews,
      },
    };
  }

  async putProductAvailibilityHandler(request, h) {
    this._productsValidator.validateUUIDParams({ id: request.params.id });

    const { value } = request.query;
    console.log(request.auth);
    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;

    await this._productsService.verifyClientAccess(productId, clientId);
    const updatedProduct = await this._productsService.updateProductAvailability(productId, value);

    return h.response({
      status: true,
      message: 'Product availability updated successfully',
      result: updatedProduct,
    });
  }

  // NEXT DEVELOPMENT START
  async postProductOptionsHandler(request, h) {
    this._productsValidator.validateUUIDParams({ id: request.params.productId });
    this._productsValidator.validatePostProductOptionsPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { productId } = request.params;
    await this._productsService.verifyClientAccess(productId, clientId);

    const productOptions = request.payload.options;
    const arrayOfOptionTitle = productOptions.map((obj) => obj.title);
    const optionsId = await this._optionsService.getOptionIdByTitle(arrayOfOptionTitle);

    const options = optionsId.map((option) => {
      const match = productOptions.find((product) => product.title === option.title);
      return { id: option.id, price: match ? match.price : 0 };
    });

    const addedProductOptions = await this._productsOptionsService.addProductOptions(
      productId,
      options,
    );

    return h
      .response({
        status: true,
        message: 'Product options added successfully',
        result: addedProductOptions,
      })
      .code(201);
  }

  async putProductOptionsHandler(request) {
    this._productsValidator.validateDeleteProductDetailsParams({ id: request.params.productId });
    this._productsValidator.validateDeleteProductDetailsParams({ id: request.params.optionId });
    this._productsValidator.validatePutProductOptionPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    const { productId, optionId } = request.params;
    const { price } = request.payload;

    await this._productsService.verifyClientAccess(productId, clientId);

    const updatedProductOption = await this._productsOptionsService.updateProductOption(
      price,
      productId,
      optionId,
    );

    return {
      status: true,
      message: 'Product option updated successfully',
      result: updatedProductOption[0],
    };
  }

  async deleteProductOptionsHandler(request) {
    this._productsValidator.validateDeleteProductDetailsParams({ id: request.params.productId });
    this._productsValidator.validateDeleteProductDetailsParams({ id: request.params.optionId });

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { productId, optionId } = request.params;

    await this._productsService.verifyClientAccess(productId, clientId);

    const deletedOption = await this._productsOptionsService.deleteProductsOptions(
      productId,
      optionId,
    );

    return {
      status: true,
      message: 'Product option deleted successfully',
      result: deletedOption[0],
    };
  }

  async getProductOptionsByProductId(request) {
    this._productsValidator.validateDeleteProductDetailsParams({ id: request.params.productId });
    const { productId } = request.params;

    const options = await this._productsOptionsService.getProductOptionsByProductId(productId);

    return {
      status: true,
      result: options,
    };
  }

  // NEXT DEVELOPMENT END
  async postTourScheduleHandler(request, h) {
    this._productsValidator.validateTourSchedulePayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: productId } = request.params;

    await this._productsService.verifyClientAccess(productId, clientId);

    const scheduleId = await this._productsService.addTourSchedule(productId, request.payload);

    return h.response({
      status: true,
      message: 'Jadwal tur berhasil ditambahkan',
      data: { scheduleId },
    }).code(201);
  }
}

module.exports = ProductsHandler;
