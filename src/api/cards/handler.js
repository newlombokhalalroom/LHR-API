const autoBind = require('auto-bind');

class CardsHandler {
  constructor(banksService, cardsService, cardsValidator) {
    this._banksService = banksService;
    this._cardsService = cardsService;
    this._cardsValidator = cardsValidator;

    autoBind(this);
  }

  async postCardsHandler(request, h) {
    this._cardsValidator.validatePostCardPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    await this._cardsService.verifyNewCard(credentialId);
    await this._banksService.getBankById(request.payload.bankId);

    const addedCard = await this._cardsService.addCard(credentialId, request.payload);

    return h
      .response({
        status: true,
        message: 'Card added successfully',
        result: addedCard,
      })
      .code(201);
  }

  async getCardsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const card = await this._cardsService.getCard(credentialId);

    return {
      status: true,
      result: card,
    };
  }

  async putCardsHandler(request) {
    this._cardsValidator.validatePutCardPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    await this._banksService.getBankById(request.payload.bankId);

    // FIX: harusnya updateCard, bukan addCard
    const updatedCard = await this._cardsService.updateCard(credentialId, request.payload);

    return {
      status: true,
      message: 'Card updated successfully',
      result: updatedCard,
    };
  }

  // SUPER ADMIN: get card by id (sudah oke)
  async getCardByIdHandler(request, h) {
    const { id } = request.params;
    const card = await this._cardsService.getCardById(id);

    const response = h.response({
      status: true,
      message: 'Card information retrieved successfully',
      result: card,
    });
    response.code(200);
    return response;
  }

  // SUPER ADMIN: get all cards
  async getAllCardsHandler(request) {
    const cards = await this._cardsService.getAllCards(request.query);

    return {
      status: true,
      ...(cards || {}),
    };
  }
}

module.exports = CardsHandler;
