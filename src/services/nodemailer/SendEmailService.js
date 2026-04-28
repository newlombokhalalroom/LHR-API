/* eslint-disable class-methods-use-this */
const { transporter } = require('../../utils/emailTransport');

class SendEmailService {
  constructor(cacheService, contactsService, emailTemplates) {
    this._cacheService = cacheService;
    this._contactsService = contactsService;
    this._emailTemplates = emailTemplates;
  }

  /**
   * Kirim kode verifikasi email ke userId tertentu.
   * Return: true kalau sukses, false kalau gagal (TIDAK throw error).
   */
  async sendEmailVerification(userId, code) {
    try {
      const email = await this._contactsService.getEmailByUserId(userId);

      const mailOptions = {
        to: email,
        from: process.env.EMAIL,
        subject: 'Email Verification Code',
        html: this._emailTemplates.verificationCode(code),
      };

      // PENTING: tunggu sendMail, biar error bisa ditangkap di sini
      await transporter.sendMail(mailOptions);

      // Simpan kode di cache hanya kalau email berhasil dikirim
      if (this._cacheService?.set) {
        await this._cacheService.set(`VerificationCode:${userId}`, code, 300);
      }

      return true;
    } catch (err) {
      console.error('sendEmailVerification error:', err);
      return false;
    }
  }

  /**
   * Kirim kode reset password ke email.
   */
  async sendResetPasswordEmail(email, code) {
    try {
      const mailOptions = {
        to: email,
        from: process.env.EMAIL,
        subject: 'Reset Password Code',
        html: this._emailTemplates.resetPasswordCode(code),
      };

      await transporter.sendMail(mailOptions);

      if (this._cacheService?.set) {
        await this._cacheService.set(`ResetPasswordCode:${code}`, email, 300);
      }

      return true;
    } catch (err) {
      console.error('sendResetPasswordEmail error:', err);
      return false;
    }
  }

  /**
   * Kirim invoice order.
   */
  async sendInvoice(email, orderId) {
    try {
      const mailOptions = {
        to: email,
        from: process.env.EMAIL,
        subject: 'Order Invoice',
        html: await this._emailTemplates.invoice(orderId),
      };

      await transporter.sendMail(mailOptions);

      return true;
    } catch (err) {
      console.error('sendInvoice error:', err);
      return false;
    }
  }
}

module.exports = SendEmailService;
