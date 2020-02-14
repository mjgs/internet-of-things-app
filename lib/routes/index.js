const debug = require('debug')('lib:routes:index'); // eslint-disable-line no-unused-vars

const express = require('express');
const router = express.Router();

const middleware = require('../middleware');

router.use(middleware.logRequest);

router.use('/', require('./dashboard'));
router.use('/', require('./throwError'));

module.exports = router;
