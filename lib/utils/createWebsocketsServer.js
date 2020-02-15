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
            data: msg.split(':')[2]
          };
          sendMsg = `Hello ${dataStore[clientSocket.id].uuid}, message received!`;
        }
      }
      else if (msg.match(/^gui:/) !== null) {
        clientSocket.gui = true;
        sendMsg = 'Hello gui, message received!';
      }

      if (sendMsg) {
        clientSocket.send(sendMsg);
        debug(`wsServer sent message: ${sendMsg}`);
      }
      else {
        debug('wsServer did not send response message');
      }
    });
  });

  wsServer.on('disconnect', function(clientSocket) {
    debug(`client disconnected: id:${clientSocket.id}`);
    let ctr = 0;
    clients.forEach(function(client) {
      if (client.id === clientSocket.id) {
        clients.splice(ctr, 1);
      }
      ctr++;
    });
    debug(`remaining clients: ${clients}`);
  });

  return wsServer;
};
