const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const middleware = require('../middleware');

router.get('/', [
  middleware.logRequest
], controllers.homepage);

module.exports = router;
