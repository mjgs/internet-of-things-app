const debug = require('debug')('lib:middleware:logRequest'); // eslint-disable-line no-unused-vars

const utils = require('../utils');

module.exports = function logRequest(req, res, next) {
  const requestInfo = utils.getRequestInfo(req);
  
  debug(JSON.stringify(requestInfo, 0, 2));

  return next();
};
