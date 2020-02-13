const debug = require('debug')('lib:routes:index'); // eslint-disable-line no-unused-vars

const express = require('express');
const router = express.Router();

router.use('/', [], require('./dashboard'));

module.exports = router;
