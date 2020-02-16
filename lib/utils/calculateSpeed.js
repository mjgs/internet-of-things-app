const debug = require('debug')('lib:utils:calculateSpeed'); // eslint-disable-line no-unused-vars

module.exports = function calculateSpeed(oldData, newData) {
  const moving = (Math.round(Math.random() * 100)) > 20;
  const speed = (moving) ? Math.round(Math.random() * 100) : 0;
  debug(`speed: ${speed} km/h`);
  return speed;
};
