const debug = require('debug')('lib:routes:dashboard'); // eslint-disable-line no-unused-vars

const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const middleware = require('../middleware');

router.get('/', [
  middleware.logRequest
], controllers.dashboard);

module.exports = router;
