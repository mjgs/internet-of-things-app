module.exports = function homepage(req, res, next) {
  return res.render('index', { title: 'Express' });
}