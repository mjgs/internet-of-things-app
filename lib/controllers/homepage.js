const debug = require('debug')('lib:controllers:homepage'); // eslint-disable-line no-unused-vars

module.exports = function homepage(req, res, next) {
  return res.render('index', { title: 'Express' });
};
