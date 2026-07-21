const InvariantError = require('../../exceptions/InvariantError');
const { PartnerHotelPayloadSchema } = require('./schema');

const PartnerHotelsValidator = {
  validatePartnerHotelPayload: (payload) => {
    const validationResult = PartnerHotelPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PartnerHotelsValidator;
