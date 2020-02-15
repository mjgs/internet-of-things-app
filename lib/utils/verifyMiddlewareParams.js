const debug = require('debug')('lib:utils:verifyMiddlwareParams'); // eslint-disable-line no-unused-vars

module.exports = function verifyMiddlewareParams(req, res, next) {
  if (typeof req !== 'object') throw new Error('Bad argument: req parameter must be an object');
  if (typeof res !== 'object') throw new Error('Bad argument: res parameter must be an object');
  if (typeof next !== 'function') throw new Error('Bad argument: next parameter must be a function');

  debug('middleware params are ok');
};
