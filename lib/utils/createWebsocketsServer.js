const debug = require('debug')('lib:utils:createWebsocketsServer'); // eslint-disable-line no-unused-vars

const WebSocket = require('ws');

module.exports = function createWebsocketsServer(server) {
  const wsServer = new WebSocket.Server({ server });

  wsServer.on('connection', function(clientSocket) {
    clientSocket.on('message', function(msg) {
      debug(`wsServer received message: ${msg}`);
      const sendMsg = `PONG from server - ${new Date()}`;
      clientSocket.send(sendMsg);
      debug(`wsServer sent message: ${sendMsg}`);
    });
  });

  return wsServer;
};
