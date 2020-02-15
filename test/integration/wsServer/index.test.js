/* eslint-env mocha */
const debug = require('debug')('test:integration:wsServer:index'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const http = require('http');
const WebSocket = require('ws');

const app = require('../../../lib/app');
const config = require('../../../lib/config');
const createWebsocketsServer = require('../../../lib/utils/createWebsocketsServer');

describe('wsServer: index', function() {
  let httpServer, wsClient, wsServer, websocketsServerUrl;

  before(function(done) {
    httpServer = http.createServer(app);
    wsServer = createWebsocketsServer(httpServer);
    httpServer.listen(config.server.port, function(err) {
      if (err) {
        return done(err);
      }
      debug(`wsServer listening on port: ${config.server.port}`);
      return done();
    });
  });

  beforeEach(function(done) {
    websocketsServerUrl = `ws://localhost:${config.server.port}/`;
    wsClient = new WebSocket(websocketsServerUrl);
    return done();
  });

  after(function(done) {
    debug('Closing wsServer...');
    wsServer.close(function(err) {
      if (err) {
        return done(err);
      }
      debug('wsServer closed');
      debug('Closing httpServer...');
      httpServer.close(function(err) {
        if (err) {
          return done(err);
        }
        debug('httpServer closed');
        return done();
      });
    });
  });

  it('should respond to client PING with server PONG', function(done) {
    wsClient.on('open', function() {
      debug(`wsClient connected to server: ${websocketsServerUrl}`);
      wsClient.on('message', function(data) {
        debug(`wsClient received message: ${data}`);
        expect(data).to.be.an('string');
        return done();
      });
      wsClient.send(`PING from client - ${new Date()}`);
    });
  });
});
