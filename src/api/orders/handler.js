const autoBind = require('auto-bind');
const schedule = require('node-schedule');
const { snap, apiClient } = require('../../utils/midtrans');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { daysCounter } = require('../../utils/daysCounter');

class OrdersHandler {
  constructor(
    ordersService,
    orderItemsService,
    contactsService,
    productsService,
    userDetailsService,
    clientDetailsService,
    orderProductDetailsService,
    balancesService,
    ordersValidator,
    clientsService,
    cacheService,
    optionsService,
    orderOptionsItemsService,
    sendEmailService,
    reviewsService,
  ) {
    this._ordersService = ordersService;
    this._orderItemsService = orderItemsService;
    this._contactsService = contactsService;
    this._productsService = productsService;
    this._userDetailsService = userDetailsService;
    this._clientDetailsService = clientDetailsService;
    this._orderProductDetailsService = orderProductDetailsService;
    this._balancesService = balancesService;
    this._ordersValidator = ordersValidator;
    this._clientsService = clientsService;
    this._cacheService = cacheService;
    this._optionsService = optionsService;
    this._orderOptionsItemsService = orderOptionsItemsService;
    this._sendEmailService = sendEmailService;
    this._reviewsService = reviewsService;

    autoBind(this);
  }

  async postOrdersHandler(request, h) {
    this._ordersValidator.validateOrdersPayload(request.payload);
    this._ordersValidator.validateUUIDParams({ id: request.params.clientId });

    const { id: credentialId } = request.auth.credentials;
    const { clientId } = request.params;
    const { startDate, endDate } = request.payload;

    let { orderItems } = request.payload;

    const productIds = orderItems.map((obj) => obj.productId);

    const filteredProductIds = productIds.filter(
      (item, index) => productIds.indexOf(item) === index,
    );

    const products = await this._productsService.verifyClientProduct(filteredProductIds, clientId);

    const quantity = daysCounter(startDate, endDate);

    orderItems = await Promise.all(
      orderItems.map(async (item) => {
        const match = products.find((product) => item.productId === product.id);
        let orderOptions = [];
        let optionPrice = 0;

        if (item.optionId) {
          orderOptions = await this._optionsService.verifyOrderOption(item.optionId);
          const additionalPrice = await this._optionsService.getOptionPrices(item.optionId);
          optionPrice = parseFloat(additionalPrice.additional_price);
        }

        return {
          ...item,
          quantity,
          orderOptions,
          optionTotalPrice: optionPrice,
          total: match.price * quantity + optionPrice,
        };
      }),
    );

    const total = this._ordersService.calculateOrderPrice(orderItems);

    const userDetails = await this._contactsService.getContactByUserId(credentialId);
    const clientDetails = await this._clientsService.getClientById(clientId);

    const { id: userDetailsId } = await this._userDetailsService.addUserDetail(
      credentialId,
      userDetails,
    );
    const { id: clientDetailsId } = await this._clientDetailsService.addClientDetails(
      clientId,
      clientDetails,
    );

    const addedOrder = await this._ordersService.addOrder(
      clientDetailsId,
      userDetailsId,
      total,
      request.payload,
    );

    const orderProductDetails = await this._orderProductDetailsService.addOrderProductDetail(
      products,
    );

    orderItems = orderItems.map((item) => {
      const match = orderProductDetails.find((product) => item.productId === product.product_id);
      return {
        orderProductDetailsId: match.id,
        quantity: item.quantity,
        options: item.orderOptions,
        optionsTotalPrice: item.optionTotalPrice,
        total: item.total,
      };
    });

    const addedOrderItems = await this._orderItemsService.addOrderItems_(addedOrder.id, orderItems);

    const response = h.response({
      status: true,
      message: 'Orders added successfully',
      result: {
        ...addedOrder,
        addedOrderItems,
      },
    });
    response.code(201);
    return response;
  }

  async getUserOrdersHandler(request) {
    this._ordersValidator.validateGetOrdersQuery(request.query);
    let { id: credentialId } = request.auth.credentials;

    if (request.auth.credentials.scope === 'admin') {
      const client = await this._clientsService.getClientIdbyOwnerId(credentialId);
      credentialId = client.id;
    }

    const orders = await this._ordersService.getOrders(request.query, credentialId);

    return {
      status: true,
      ...(orders || {}),
    };
  }

  async getUserOrderByIdHandler(request) {
    this._ordersValidator.validateUUIDParams(request.params);

    let { id: credentialId } = request.auth.credentials;
    const { id: orderId } = request.params;

    if (request.auth.credentials.scope === 'admin') {
      const client = await this._clientsService.getClientIdbyOwnerId(credentialId);
      credentialId = client.id;
    }

    await this._ordersService.verifyOrderOwner(credentialId, orderId);
    const order = await this._ordersService.getOrderById(orderId);
    const items = await this._orderItemsService.getOrderItems(orderId);

    return {
      status: true,
      result: order?.result,
    };
  }

  async getUserInvoiceByOrderIdHandler(request) {
    this._ordersValidator.validateUUIDParams(request.params);
    let { id: credentialId } = request.auth.credentials;

    if (request.auth.credentials.scope === 'admin') {
      const client = await this._clientsService.getClientIdbyOwnerId(credentialId);
      credentialId = client.id;
    }

    await this._ordersService.verifyOrderOwner(credentialId, request.params.id);

    const order = await this._ordersService.getInvoiceByOrderId(request.params.id);

    const userDetails = await this._userDetailsService.getUserDetailsById(order.user_details_id);

    const clientDetails = await this._clientDetailsService.getClientDetailsById(
      order.client_details_id,
    );

    const orderItems = await this._orderItemsService.getInvoiceItems(request.params.id);

    return {
      status: true,
      result: {
        ...order,
        userDetails,
        clientDetails,
        orderItems,
      },
    };
  }

  async getMidSnapTokenHandler(request) {
    this._ordersValidator.validateUUIDParams(request.params);
    const { id: orderId } = request.params;
    let { id: credentialId } = request.auth.credentials;

    await this._ordersService.verifyOrderOwner(credentialId, orderId);

    const order = await this._ordersService.getInvoiceByOrderId(orderId);

    if (order.status !== 'unpaid') {
      throw new InvariantError(`Invalid order status: ${order.status}`);
    }

    try {
      const token = await this._cacheService.get(`PaymentToken:${orderId}`);
      const redirect_url = await this._cacheService.get(`PaymentURL:${orderId}`);

      return {
        status: true,
        result: {
          token,
          redirect_url,
        },
      };
    } catch (e) {
      // CONTINUE
    }

    const userDetails = await this._userDetailsService.getUserDetailsById(order.user_details_id);
    const orderItems = await this._orderItemsService.getInvoiceItems(request.params.id);
    const optionsItems = await this._orderOptionsItemsService.getOrderOptionsItemsByOrderId(
      request.params.id,
    );

    let paramsOrderItems = orderItems.map((item) => ({
      id: item.id,
      name: item.title,
      price: parseFloat(item.price),
      quantity: item.quantity,
    }));

    if (optionsItems.length > 0) {
      const paramsOptionsItems = optionsItems.map((item) => ({
        id: item.id,
        name: item.title,
        price: parseFloat(item.price),
        quantity: 1,
      }));

      paramsOrderItems = [...paramsOrderItems, ...paramsOptionsItems];
    }

    let parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: parseFloat(order.total),
      },
      credit_card: {
        secure: true,
      },
      item_details: paramsOrderItems,
      customer_details: {
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        email: userDetails.email,
        phone: userDetails.phone,
      },
    };

    const midtransSnap = await snap.createTransaction(parameter);

    await this._cacheService.set(
      `PaymentToken:${orderId}`,
      midtransSnap.token,
      process.env.SNAP_TOKEN_DURATION,
    );
    await this._cacheService.set(
      `PaymentURL:${orderId}`,
      midtransSnap.redirect_url,
      process.env.SNAP_TOKEN_DURATION,
    );

    return {
      status: true,
      result: midtransSnap,
    };
  }

  async sendInvoiceToUsersAndClient(user_details_id, client_details_id, orderId) {
    const { email: clientEmail } = await this._contactsService.getClientContactByClientDetailsId(
      client_details_id,
    );
    const { email: userEmail } = await this._contactsService.getUserContactByUserDetailsId(
      user_details_id,
    );
    await this._sendEmailService.sendInvoice(clientEmail, orderId);
    await this._sendEmailService.sendInvoice(userEmail, orderId);
  }

  async midtransNotificationHandler(request) {
    const notification = await apiClient.transaction.notification(request.payload);

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    const {
      status: order_status,
      user_details_id,
      client_details_id,
    } = await this._ordersService.getInvoiceByOrderId(orderId);

    if (order_status !== 'unpaid') {
      return {
        status: true,
      };
    }

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        await this._ordersService.putOrderStatus('process', orderId);
        console.log(`Order ${orderId} is Process.`);
        this.scheduleCancellation(orderId, process.env.AUTO_CANCEL_DURATION);

        // sending email
        this.sendInvoiceToUsersAndClient(user_details_id, client_details_id, orderId).catch(
          (error) => console.log(error),
        );
      }
    } else if (transactionStatus === 'settlement') {
      await this._ordersService.putOrderStatus('process', orderId);
      console.log(`Order ${orderId} is Process.`);
      this.scheduleCancellation(orderId, process.env.AUTO_CANCEL_DURATION);

      // sending email
      this.sendInvoiceToUsersAndClient(user_details_id, client_details_id, orderId).catch((error) => console.log(error));
    } else if (
      transactionStatus === 'cancel'
      || transactionStatus === 'deny'
      || transactionStatus === 'expire'
    ) {
      await this._ordersService.putOrderStatus('cancelled', orderId);
    } else if (transactionStatus === 'pending') {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OKa
    }

    return {
      status: true,
    };
  }

  scheduleCancellation(orderId, durationInSeconds) {
    const cancelledDate = new Date(Date.now() + durationInSeconds * 1000); // 10000 ms
    schedule.scheduleJob(cancelledDate, async () => {
      const {
        result: { status: orderStatus, total, user_id: userId },
      } = await this._ordersService.getOrderById(orderId);
      if (orderStatus === 'process') {
        await this._ordersService.putOrderStatus('cancelled', orderId);
        console.log(`Order ${orderId} is Cancelled.`);

        await this._balancesService.increaseUserBalance(total, userId);
        console.log(`User ${userId} Balance is Increased.`);
      } else {
        console.log('Scheduled Cancellation is Not Executed.');
      }
    });
  }

  scheduleCompletion(orderId, endDate, ownerId, durationInSeconds) {
    const completionDate = new Date(endDate.getTime() + durationInSeconds * 1000);

    // this for debuging purposes
    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((new Date(completionDate) - currentTime) / 1000);
    console.log(`Completion will be executed in ${timeDifferenceInSeconds} seconds.`);

    schedule.scheduleJob(completionDate, async () => {
      const {
        result: { status: orderStatus, total },
      } = await this._ordersService.getOrderById(orderId);
      if (orderStatus === 'progress') {
        await this._ordersService.putOrderStatus('done', orderId);
        console.log(`Order ${orderId} is Done.`);

        await this._balancesService.increaseUserBalance(total, ownerId);
        console.log(`User ${ownerId} Balance is Increased.`);
      } else {
        console.log('Scheduled Completion is Not Executed.');
      }
    });
  }

  async putOrderConfirmationStatusHandler(request) {
    this._ordersValidator.validateUUIDParams({ id: request.params.id });
    this._ordersValidator.validateConfimationStatusParams({ status: request.params.status });

    const { id: credentialId } = request.auth.credentials;
    const client = await this._clientsService.getClientIdbyOwnerId(credentialId);
    const { id: orderId, status } = request.params;
    await this._ordersService.verifyOrderOwner(client.id, orderId);
    const {
      status: order_status,
      total,
      user_details_id,
      end_date: endDate,
    } = await this._ordersService.getInvoiceByOrderId(orderId);
    const userDetails = await this._userDetailsService.getUserDetailsById(user_details_id);

    if (order_status !== 'process') {
      throw new InvariantError(`Invalid order status: ${order_status}`);
    }

    const order = await this._ordersService.putOrderStatus(status, orderId);

    if (status === 'cancelled') {
      await this._balancesService.increaseUserBalance(total, userDetails.user_id);
      console.log(`User ${userDetails.user_id} Balance is Increased.`);
    } else {
      this.scheduleCompletion(orderId, endDate, credentialId, process.env.AUTO_COMPLETE_DURATION);
    }

    return {
      status: true,
      message: 'Order status updated successfully',
      result: order,
    };
  }

  async putOrderCompletedStatusHandler(request) {
    this._ordersValidator.validateUUIDParams({ id: request.params.id });

    const { id: credentialId } = request.auth.credentials;
    const { id: orderId } = request.params;

    await this._ordersService.verifyOrderOwner(credentialId, orderId);
    const {
      status: order_status,
      total,
      client_details_id,
      end_date: endDate,
    } = await this._ordersService.getInvoiceByOrderId(orderId);
    const clientDetails = await this._clientDetailsService.getClientDetailsById(client_details_id);
    const { owner_id } = await this._clientsService.getUserByClientId(clientDetails.client_id);

    if (order_status !== 'progress') {
      throw new InvariantError(`Invalid ord er status: ${order_status}`);
    }

    // for debugging purposes
    const currentTime = new Date();
    console.log(currentTime);
    console.log(endDate);

    if (currentTime < endDate) {
      throw new InvariantError('Invalid date');
    }

    await this._balancesService.increaseUserBalance(total, owner_id);
    const order = await this._ordersService.putOrderStatus('done', orderId);

    return {
      status: true,
      message: 'Order status updated successfully',
      result: order,
    };
  }

  async getUserOrdersSummaryHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { lastmonths } = request.query;

    const { id: clientId } = await this._clientsService.getClientIdbyOwnerId(credentialId);

    const orders = await this._ordersService.getOrders(request.query, clientId);
    const process = this.calculateOrderPercentage(orders.result, 'process', lastmonths);
    const progress = this.calculateOrderPercentage(orders.result, 'progress', lastmonths);
    const done = this.calculateOrderPercentage(orders.result, 'done', lastmonths);
    const cancelled = this.calculateOrderPercentage(orders.result, 'cancelled', lastmonths);
    const income = this.calculateIncome(this.filterLastObject(orders.result, lastmonths));
    return {
      status: true,
      result: {
        total: this.filterLastObject(orders.result, lastmonths).length,
        income,
        process,
        progress,
        done,
        cancelled,
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  filterObjectByValue(arr, key, value) {
    return arr.filter((obj) => obj[key] === value);
  }

  // eslint-disable-next-line class-methods-use-this
  filterLastObject(arr, days = 0, key = '_created_date') {
    const currentDate = new Date();
    const lastDaysAgo = new Date(currentDate.getTime() - 30 * days * 24 * 60 * 60 * 1000); // Calculate date 30 days ago

    return arr.filter((obj) => {
      const createdDate = new Date(obj[key]); // Assuming _created_date is in a format that can be converted to a Date object
      return createdDate >= lastDaysAgo && createdDate <= currentDate;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  calculateOrderPercentage(order, status, days) {
    const filteredOrder = this.filterObjectByValue(order, 'status', status);
    const filtered1 = this.filterLastObject(order, days);
    const filtered2 = this.filterLastObject(filteredOrder, days);
    // eslint-disable-next-line no-mixed-operators
    const percentage = (filtered2.length / filtered1.length) * 100;
    return {
      // filtered2,
      total: filtered2.length,
      percentage,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  calculateIncome(order, status = 'done') {
    const filteredOrder = this.filterObjectByValue(order, 'status', status);
    return filteredOrder.reduce((total, obj) => total + (obj.total || 0), 0);
  }

  async postProductReviewHandler(request, h) {
    this._ordersValidator.validatePostReviewParams(request.params);
    this._ordersValidator.validatePostReviewPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { orderId, productId } = request.params;
    const { reviewContent, reviewRate } = request.payload;

    const { result: order } = await this._ordersService.getOrderById(orderId);

    if (order.status !== 'done') {
      throw new InvariantError('The order is not yet completed.');
    }

    if (order.user_id !== userId) {
      throw new AuthorizationError('This order does not belong to the user.');
    }

    const productExists = order.items.some((item) => item.product_id === productId);
    if (!productExists) {
      throw new InvariantError('This order does not contain the specified product.');
    }

    await this._reviewsService.checkExistingReviewForProductInOrder(orderId, productId);

    const result = await this._reviewsService.postReview(
      orderId,
      userId,
      productId,
      reviewContent,
      reviewRate,
    );

    const response = h.response({
      status: true,
      message: 'Review added successfully',
      result,
    });
    response.code(201);
    return response;
  }

  async getAllOrdersHandler(request, h) {
    const { page, limit } = request.query;

    const orders = await this._ordersService.getAllOrdersWithPagination({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });

    return h
      .response({
        status: true,
        message: 'Orders retrieved successfully',
        result: orders.result,
        meta: {
          page: orders.page,
          limit: orders.limit,
          total: orders.total,
        },
      })
      .code(200);
  }

  async putOrderHandler(request, h) {
    this._ordersValidator.validateUpdateOrderPayload(request.payload);

    const { id } = request.params;
    const updatedOrder = await this._ordersService.updateOrderById(id, request.payload);

    return h
      .response({
        status: true,
        message: 'Order updated successfully',
        result: updatedOrder,
      })
      .code(200);
  }

  async deleteOrderHandler(request, h) {
    const { id } = request.params;

    const deleted = await this._ordersService.deleteOrderById(id);

    return h
      .response({
        status: true,
        message: `Order with ID ${deleted.id} deleted successfully`,
      })
      .code(200);
  }

  async testCacheHandler(request, h) {
    const cacheService = this._cacheService;
    const key = 'test-cache';

    try {
      const cached = await cacheService.get(key);
      return h.response({
        status: true,
        message: 'from redis',
        data: cached,
      });
    } catch (_) {
      await cacheService.set(key, 'Redis bekerja 🚀', 60);
      return h.response({
        status: true,
        message: 'from db',
        data: 'Redis bekerja 🚀',
      });
    }
  }

  async getSuperAdminOrderByIdHandler(request, h) {
    this._ordersValidator.validateUUIDParams(request.params);

    const { id: orderId } = request.params;

    const order = await this._ordersService.getOrderById(orderId);

    return h
      .response({
        status: true,
        result: order?.result,
      })
      .code(200);
  }
}

module.exports = OrdersHandler;
