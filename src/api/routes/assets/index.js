const express = require('express');
const controller = require('../../controllers/asset.controller');
const validate = require('express-validation');
const { getAsset } = require('../../validations/asset.validation');

const router = express.Router();

router.get('/video/:uid', validate(getAsset), controller.getVideoStream);
router.get('/thumbnail/:uid', validate(getAsset), controller.getVideoThumbnail);
router.get('/image/:uid', validate(getAsset), controller.getImage);

module.exports = router;
