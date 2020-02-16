const debug = require('debug')('lib:utils:highlightRow'); // eslint-disable-line no-unused-vars

const dataStore = require('./dataStore');

module.exports = function highlightRow(socketId) {
  const highlightRow = Boolean(dataStore[socketId].speed === 0);
  debug(`highlightRow: ${highlightRow}`);
  return highlightRow;
};
