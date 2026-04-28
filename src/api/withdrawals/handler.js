const autoBind = require('auto-bind');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CardsHandler {
  constructor(cardsService, balancesService, withdrawalsService, withdrawalsValidator) {
    this._cardsService = cardsService;
    this._balancesService = balancesService;
    this._withdrawalsService = withdrawalsService;
    this._withdrawalsValidator = withdrawalsValidator;

    autoBind(this);
  }

  async postWithdrawalsHandler(request, h) {
    this._withdrawalsValidator.validatePostWithdrawalPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;

    const { id: cardId } = await this._cardsService.getCard(credentialId);
    const { id: balanceId, amount: balanceAmount } =
      await this._balancesService.getBalanceByUserId(credentialId);
    const { amount } = request.payload;

    if (amount > balanceAmount) {
      throw new InvariantError(`Balance is not enough. Your balance: ${balanceAmount}`);
    }

    const withdrawals = await this._withdrawalsService.addWithdrawals(cardId, balanceId, amount);

    const { amount: balance } = await this._balancesService.decreaseUserBalance(
      amount,
      credentialId,
    );

    return h.response({
      status: true,
      message: 'Withdrawals successfully',
      result: {
        ...withdrawals,
        balance,
      },
    });
  }

  async getWithdrawalsHandler(request) {
    let { id: credentialId, scope } = request.auth.credentials;
    const { status } = request.query;

    if (scope === 'super-admin') {
      credentialId = null;
    }

    const withdrawals = await this._withdrawalsService.getWithdrawals(
      credentialId,
      status,
      request.query,
    );

    return {
      status: true,
      ...(withdrawals || {}),
    };
  }

  async getWithdrawalsByIdHandler(request) {
    this._withdrawalsValidator.validateUUIDParams(request.params);
    let { id: credentialId, scope } = request.auth.credentials;

    if (scope !== 'super-admin') {
      await this._withdrawalsService.verifyUserAccess(credentialId, request.params.id);
    }

    const withdrawal = await this._withdrawalsService.getWithdrawalsById(request.params.id);
    const card = await this._cardsService.getCardById(withdrawal.card_id);

    return {
      status: true,
      result: {
        ...withdrawal,
        card,
      },
    };
  }

  async putWithdrawalsStatusHandler(request, h) {
    this._withdrawalsValidator.validateUUIDParams(request.params);
    this._withdrawalsValidator.validatePutWithdrawalStatusPayload(request.payload);

    const { id: withdrawalId } = request.params;
    const { status } = request.payload; // cancelled | success

    const updated = await this._withdrawalsService.updateWithdrawalStatusAtomic(
      withdrawalId,
      status,
    );

    return h
      .response({
        status: true,
        message: 'Withdrawal status updated successfully',
        result: updated,
      })
      .code(200);
  }

  async getTotalUserLiabilityHandler(request, h) {
    const res = await this._service.getTotalUserLiability();

    return h
      .response({
        status: true,
        message: 'Total user liability fetched',
        data: res,
      })
      .code(200);
  }
  async getTotalLiabilityHandler(request, h) {
    const me = request.auth.credentials?.id;
    if (!me) {
      return h.response({ status: false, message: 'Unauthorized' }).code(401);
    }

    const data = await this._balancesService.getTotalLiabilityExcludeMe(me);

    return h
      .response({
        status: true,
        message: 'Total liability fetched',
        data,
      })
      .code(200);
  }
}

module.exports = CardsHandler;
