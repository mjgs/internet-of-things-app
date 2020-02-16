const debug = require('debug')('lib:utils:createWebsocketsServer'); // eslint-disable-line no-unused-vars

const WebSocket = require('ws');

const dataStore = require('./dataStore');
const calculateSpeed = require('./calculateSpeed');
const validateUuidData = require('./validateUuidData');

const clientsStore = [];

module.exports = function createWebsocketsServer(server) {
  if (typeof server !== 'object') throw new Error('Bad argument: server must be an object');

  const wsServer = new WebSocket.Server({ server });

  let i = 0;

  wsServer.on('connection', function(clientSocket) {
    clientSocket.id = i++;
    clientsStore.push(clientSocket);

    clientSocket.on('message', function(msg) {
      debug(`wsServer received message: ${msg}`);

      let sendMsg;

      if (msg.match(/^PING/) !== null) {
        sendMsg = 'PONG from server';
      }
      else if (msg.match(/^uuid:/) !== null) {
        const data = validateUuidData(msg);

        if (data) {
          const newTimestamp = Date.now();
          const newUuid = data.uuid;
          const newLat = data.lat;
          const newLong = data.long;

          if (typeof dataStore.getDataStore()[clientSocket.id] !== 'undefined') {
            const prevUuid = dataStore.getDataStore()[clientSocket.id].uuid;
            const prevTimestamp = dataStore.getDataStore()[clientSocket.id].timestamp;
            const prevLat = dataStore.getDataStore()[clientSocket.id].lat;
            const prevLong = dataStore.getDataStore()[clientSocket.id].long;

            if (prevUuid) {
              debug(`uuid has chanhed from ${prevUuid} to ${newUuid}`);
            }

            dataStore.getDataStore()[clientSocket.id] = {
              timestamp: newTimestamp,
              uuid: newUuid,
              lat: newLat,
              long: newLong,
              speed: calculateSpeed(prevTimestamp, prevLat, prevLong, newTimestamp, newLat, newLong),
              gui: false
            };
          }
          else {
            dataStore.getDataStore()[clientSocket.id] = {
              timestamp: newTimestamp,
              uuid: newUuid,
              lat: newLat,
              long: newLong,
              speed: 0,
              gui: false
            };
          }

          sendMsg = `Hello ${newUuid}, message received!`;
        }
        else {
          debug('received message was not in the uuid format');
        }
      }
      else if (msg.match(/^gui:/) !== null) {
        if (msg.split(':').length === 2) {
          dataStore.getDataStore()[clientSocket.id] = {
            timestamp: Date.now(),
            uuid: msg.split(':')[1],
            lat: null,
            long: null,
            speed: null,
            gui: true
          };
          sendMsg = `Hello ${dataStore.getDataStore()[clientSocket.id].uuid}, message received!`;
        };
      }

      if (sendMsg) {
        clientSocket.send(sendMsg);
        debug(`wsServer sent message: ${sendMsg}`);
      }
      else {
        debug('wsServer did not send response message');
      }
    });

    wsServer.on('close', function() {
      debug(`Socket connection closed by client id: ${clientSocket.id}`);

      let index;
      for (let i = 0; i < clientsStore.length; i++) {
        if (clientSocket.id === clientsStore[i].id) {
          index = i;
          break;
        }
      }

      if (typeof index !== 'undefined') {
        debug(`removing client with id: ${clientsStore[index].id}`);
        clientsStore.splice(index, 1);
      }
      debug(`remaining clients: ${clientsStore}`);
    });
  });

  return wsServer;
};
