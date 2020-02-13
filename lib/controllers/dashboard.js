const debug = require('debug')('lib:controllers:dashboard'); // eslint-disable-line no-unused-vars

module.exports = function dashboard(req, res, next) {
  return res.render('index', { title: 'Dashboard' });
};
