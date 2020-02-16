const debug = require('debug')('lib:controllers:dashboard'); // eslint-disable-line no-unused-vars

const utils = require('../utils');
const dataStore = require('../utils/dataStore');

module.exports = function dashboard(req, res, next) {
  utils.verifyMiddlewareParams(req, res, next);

  const locals = {
    title: 'Dashboard',
    data: dataStore
  };

  return res.render('index', locals);
};
