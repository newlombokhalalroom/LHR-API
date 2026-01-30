const routes = (handler) => [
  // todo: update
  {
    method: 'GET',
    path: '/products',
    handler: handler.getProductsWithClientHandler,
  },
  // todo: partial update
  {
    method: 'PATCH',
    path: '/products/{id}',
    handler: handler.patchProductsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },

  // etc
  {
    method: 'POST',
    path: '/products',
    handler: handler.postProductsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'POST',
    path: '/products/{id}/amenities',
    handler: handler.postProductAmenitiesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'POST',
    path: '/products/{id}/pictures',
    handler: handler.postProductPicturesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'POST',
    path: '/products/{id}/details',
    handler: handler.postProductDetailsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/products/{id}',
    handler: handler.putProductsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: handler.deleteProductHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  // todo:overrided by client routes
  // {
  //   method: 'GET',
  //   path: '/clients/{id}/products',
  //   handler: handler.getClientProductsHandler,
  // },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: handler.getProductByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/products/{productId}/amenities/{amenityId}',
    handler: handler.deleteProductAmenitiesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/products/{productId}/pictures/{pictureId}',
    handler: handler.deleteProductPicturesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/products/{productId}/details/{detailId}',
    handler: handler.putProductDetailHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/products/{productId}/details/{detailId}',
    handler: handler.deleteProductDetailsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'POST',
    path: '/products/{id}/items',
    handler: handler.postProductItemHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/products/{productId}/items/{itemId}',
    handler: handler.putProductItemHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/products/{productId}/items/{itemId}',
    handler: handler.deleteProductItemHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/products/{productId}/items',
    handler: handler.getProductItemsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/products/items',
    handler: handler.getProductsItemsHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/products/{productId}/items/{itemId}',
    handler: handler.getProductItemByIdHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'POST',
    path: '/products/{productId}/items/{itemId}/unavailable',
    handler: handler.postProductItemAsUnavailableHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/products/unavailable',
    handler: handler.getAllProductItemUnavailableStatusHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/products/unavailable/{clientId}',
    handler: handler.getAllProductItemUnavailableByClientIdStatusHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/products/{productId}/items/{itemId}/unavailable',
    handler: handler.getProductItemUnavailableStatusHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/products/{productId}/items/{itemId}/unavailable/{statusId}',
    handler: handler.deleteProductItemUnavailableStatusHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/products/cars',
    handler: handler.getCarsHandler,
  },
  // product's policies
  {
    method: 'POST',
    path: '/products/{id}/policies',
    handler: handler.postProductPoliciesHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'PUT',
    path: '/products/{id}/policies/{policyId}',
    handler: handler.putProductPolicyHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/products/{id}/policies/{policyId}',
    handler: handler.deleteProductPolicyHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/products/{id}/reviews',
    handler: handler.getProductReviews,
  },
  {
    method: 'PUT',
    path: '/products/{id}/availability',
    handler: handler.putProductAvailibilityHandler,
    config: {
      auth: {
        strategy: 'lombokhalalroom_jwt',
        scope: 'admin',
      },
    },
  },

  // NEXT DEVELOPMENT START

  // {
  //   method: 'POST',
  //   path: '/products/{productId}/options',
  //   handler: handler.postProductOptionsHandler,
  //   config: {
  //     auth: {
  //       strategy: 'lombokhalalroom_jwt',
  //       scope: 'admin',
  //     },
  //   },
  // },
  // {
  //   method: 'PUT',
  //   path: '/products/{productId}/options/{optionId}',
  //   handler: handler.putProductOptionsHandler,
  //   config: {
  //     auth: {
  //       strategy: 'lombokhalalroom_jwt',
  //       scope: 'admin',
  //     },
  //   },
  // },
  // {
  //   method: 'DELETE',
  //   path: '/products/{productId}/options/{optionId}',
  //   handler: handler.deleteProductOptionsHandler,
  //   config: {
  //     auth: {
  //       strategy: 'lombokhalalroom_jwt',
  //       scope: 'admin',
  //     },
  //   },
  // },
  // {
  //   method: 'GET',
  //   path: '/products/{productId}/options',
  //   handler: handler.getProductOptionsByProductId,
  // },

  // NEXT DEVELOPMENT END
];

module.exports = routes;
