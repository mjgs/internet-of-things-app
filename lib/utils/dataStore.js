const debug = require('debug')('lib:utils:dataStore'); // eslint-disable-line no-unused-vars

let dataStore = {};

function getDataStore() {
  debug('Fetching the datastore');
  return dataStore;
}

function clearDataStore() {
  debug('Clearing the datastore');
  dataStore = {};
}

module.exports = {
  getDataStore: getDataStore,
  clearDataStore: clearDataStore
};
