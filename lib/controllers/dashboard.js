const debug = require('debug')('lib:controllers:dashboard'); // eslint-disable-line no-unused-vars

const utils = require('../utils');

module.exports = function dashboard(req, res, next) {
  utils.verifyMiddlewareParams(req, res, next);

  return res.render('index', { title: 'Dashboard' });
};
