const Joi = require('joi');

module.exports = {
  // GET /illuminoro-assets/[]/:userId
  getAsset: {
    params: {
      uid: Joi.string().required(),
    },
  },
};
