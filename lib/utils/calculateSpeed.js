const debug = require('debug')('lib:utils:calculateSpeed'); // eslint-disable-line no-unused-vars

module.exports = function calculateSpeed(oldData, newData) {
  const speed = Math.round(Math.random() * 100);
  debug(`speed: ${speed} km/h`);
  return speed;
};
