const debug = require('debug')('lib:middleware:throwError'); // eslint-disable-line no-unused-vars

module.exports = function throwError(req, res, next) {
  return next(new Error('throwing an error!'));
};
