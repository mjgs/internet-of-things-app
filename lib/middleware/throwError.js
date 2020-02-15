const debug = require('debug')('lib:middleware:throwError'); // eslint-disable-line no-unused-vars

const utils = require('../utils');

module.exports = function throwError(req, res, next) {
  utils.verifyMiddlewareParams(req, res, next);

  return next(new Error('throwing an error!'));
};
