/* eslint-disable class-methods-use-this */
const crypto = require('crypto');
const autoBind = require('auto-bind');

class VerificationHandler {
  constructor(sendEmailService, contactsService) {
    this._sendEmailService = sendEmailService;
    this._contactsService = contactsService;
    autoBind(this);
  }

  async sendEmailVerificationCodeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const code = crypto.randomInt(100000, 999999).toString();

    const ok = await this._sendEmailService.sendEmailVerification(credentialId, code);

    if (!ok) {
      return h
        .response({
          status: false,
          message: 'Gagal mengirim kode verifikasi. Silakan coba lagi.',
          code: 'EMAIL_SEND_FAILED',
        })
        .code(200);
    }

    return {
      status: true,
      message: 'Verification code sent successfully',
    };
  }

  async editEmailVerifiedStatusHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { code } = request.payload;
    await this._contactsService.validateVerificationCode(credentialId, code);
    return {
      status: true,
      message: 'Email verified successfully',
    };
  }
}
module.exports = VerificationHandler;
