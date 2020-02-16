const debug = require('debug')('lib:utils:highlightRow'); // eslint-disable-line no-unused-vars

module.exports = function highlightRow() {
  const highlightRow = Boolean(Math.round(Math.random()));
  debug(`highlightRow: ${highlightRow}`);
  return highlightRow;
};
