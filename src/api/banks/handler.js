const autoBind = require('auto-bind');

class BanksHandler {
  constructor(BanksValidator, banksService) {
    this._BanksValidator = BanksValidator;
    this._banksService = banksService;
    autoBind(this);
  }

  async postBanksHandler(request, h) {
    this._BanksValidator.validatePostBankPayload(request.payload);
    const { code, title, icon } = request.payload;
    await this._banksService.verifyNewBankCode(code);
    const addedBank = await this._banksService.addBank(code, title, icon);
    const response = h.response({
      status: true,
      message: 'Bank added successfully',
      result: addedBank,
    });
    response.code(201);
    return response;
  }

  async putBankHandler(request) {
    this._BanksValidator.validateUUIDParams({ id: request.params.bankId });
    this._BanksValidator.validatePostBankPayload(request.payload);
    const { code, title, icon } = request.payload;
    const { bankId } = request.params;

    const bank = await this._banksService.getBankById(bankId);
    if (bank.code !== code) {
      await this._banksService.verifyNewBankCode(code);
    }

    const updateBank = await this._banksService.updateBank(bankId, code, title, icon);
    return {
      status: true,
      message: 'Bank updated successfully',
      result: updateBank,
    };
  }

  async getBanksHandler() {
    return {
      status: true,
      result: await this._banksService.getBanks(),
    };
  }
}

module.exports = BanksHandler;
