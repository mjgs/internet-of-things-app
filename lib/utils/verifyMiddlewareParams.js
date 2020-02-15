const debug = require('debug')('lib:utils:verifyMiddlwareParams'); // eslint-disable-line no-unused-vars

module.exports = function verifyMiddlewareParams(req, res, next) {
  if (typeof req !== 'object') throw new Error('Bad argument: req must be an object');
  if (typeof res !== 'object') throw new Error('Bad argument: res must be an object');
  if (typeof next !== 'function') throw new Error('Bad argument: next must be a function');

  debug('middleware params are ok');
};
