const debug = require('debug')('lib:utils:calculateSpeed'); // eslint-disable-line no-unused-vars

const geolib = require('geolib');

function checkArgsSet (t, lat, long) {
  if (t < 0) return false;
  if (typeof lat !== 'number') return false;
  if (typeof long !== 'number') return false;
  return true;
}

module.exports = function calculateSpeed(t1, lat1, long1, t2, lat2, long2) {
  if (!checkArgsSet(t1, lat1, long1)) return null;
  if (!checkArgsSet(t2, lat2, long2)) return null;
  if (t1 > t2) return null;

  const start = { latitude: lat1, longitude: long1 };
  const end = { latitude: lat2, longitude: long2 };
  const accuracy = 1;

  const distance = geolib.getDistance(start, end, accuracy);

  let speed;
  const movedMoreThanOneMeter = (distance > 1);
  if (movedMoreThanOneMeter) {
    const timeDiffSeconds = (t2 - t1) / 1000;
    speed = Math.round(distance / timeDiffSeconds);
  }
  else {
    speed = 0;
  }

  debug(`speed: ${speed} meters/second`);
  return speed;
};
