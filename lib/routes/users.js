const debug = require('debug')('lib:routes:users'); // eslint-disable-line no-unused-vars

const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const middleware = require('../middleware');

router.get('/', [
  middleware.logRequest
], controllers.users);

module.exports = router;
