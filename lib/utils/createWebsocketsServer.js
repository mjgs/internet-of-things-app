const debug = require('debug')('lib:utils:createWebsocketsServer'); // eslint-disable-line no-unused-vars

const WebSocket = require('ws');

module.exports = function createWebsocketsServer(server) {
  if (typeof server !== 'object') throw new Error('Bad argument: server must be an object');

  const wsServer = new WebSocket.Server({ server });

  wsServer.on('connection', function(clientSocket) {
    clientSocket.on('message', function(msg) {
      debug(`wsServer received message: ${msg}`);

      let sendMsg;

      if (msg.match(/^PING/) !== null) {
        sendMsg = `PONG from server - ${new Date()}`;
      }
      else if (msg.match(/^uuid:/) !== null) {
        sendMsg = `Received! - ${new Date()}`;
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

  return wsServer;
};
