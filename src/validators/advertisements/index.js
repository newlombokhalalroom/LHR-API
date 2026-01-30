const InvariantError = require('../../exceptions/InvariantError');
const { AdvertisementPayloadSchema, UpdateAdvertisementPayloadSchema } = require('./schema');

const AdvertisementsValidator = {
  validateAdvertisementPayload: (payload) => {
    const result = AdvertisementPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },

  validateUpdateAdvertisementPayload: (payload) => {
    const result = UpdateAdvertisementPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = AdvertisementsValidator;
