const debug = require('debug')('lib:utils:validateUuidData'); // eslint-disable-line no-unused-vars

const validator = require('validator');

module.exports = function validateUuidData(data) {
  if (typeof data !== 'string') return false;

  const parts = data.split(':');
  if (parts.length !== 4) return false;
  if (parts[0] !== 'uuid') return false;
  const uuid = parts[1];
  if (!validator.isUUID(uuid, 4)) return false;

  const lat = parseFloat(parts[2]);
  const long = parseFloat(parts[3]);
  if (!validator.isLatLong(`(${lat}, ${long})`)) return false;

  const validated = {
    uuid: uuid,
    lat: lat,
    long: long
  };

  debug(`validated: ${validated}`);
  return validated;
};
