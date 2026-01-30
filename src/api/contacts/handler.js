const autoBind = require('auto-bind');

class ContactsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async updateContactHandler(request, h) {
    this._validator.validateContactPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    await this._service.editContactByUserId(credentialId, request.payload);
    const response = h.response({
      status: true,
      message: 'Contact updated successfully',
    });
    return response;
  }

  async getContactByUserIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const contact = await this._service.getContactByUserId(credentialId);
    return {
      status: true,
      result: {
        contact,
      },
    };
  }
}

module.exports = ContactsHandler;
