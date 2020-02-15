const debug = require('debug')('lib:utils:createWebsocketsServer'); // eslint-disable-line no-unused-vars

const WebSocket = require('ws');

const clientsStore = [];
const dataStore = {};

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
        if (msg.split(':').length === 3) {
          dataStore[clientSocket.id] = {
            uuid: msg.split(':')[1],
            data: msg.split(':')[2],
            gui: false
          };
          sendMsg = `Hello ${dataStore[clientSocket.id].uuid}, message received!`;
        }
      }
      else if (msg.match(/^gui:/) !== null) {
        if (msg.split(':').length === 2) {
          dataStore[clientSocket.id] = {
            uuid: msg.split(':')[1],
            data: null,
            gui: true
          };
          sendMsg = `Hello ${dataStore[clientSocket.id].uuid}, message received!`;
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
