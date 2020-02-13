const debug = require('debug')('lib:routes:throwError'); // eslint-disable-line no-unused-vars

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');

router.get('/throwError', [
  middleware.throwError
], middleware.throwError);

module.exports = router;
