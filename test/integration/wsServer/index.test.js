/* eslint-env mocha */
const debug = require('debug')('test:integration:wsServer:index'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const http = require('http');
const WebSocket = require('ws');
const chance = new (require('chance'))();
const uuidv4 = require('uuid/v4');
const async = require('async');
const request = require('request');
const cheerio = require('cheerio');

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
        expect(data).to.have.string('PONG');
        wsClient.close();
        return done();
      });
      wsClient.send(`PING from client - ${new Date()}`);
    });
  });

  it('should respond to client data update with ack', function(done) {
    const mockUuid = uuidv4();
    const data = chance.word();
    wsClient.on('open', function() {
      debug(`wsClient connected to server: ${websocketsServerUrl}`);
      wsClient.on('message', function(data) {
        debug(`wsClient received message: ${data}`);
        expect(data).to.be.an('string');
        expect(data).to.have.string(`Hello ${mockUuid}, message received!`);
        wsClient.close();
        return done();
      });
      wsClient.send(`uuid:${mockUuid}:${data}`);
    });
  });

  it('should respond to client gui message with ack', function(done) {
    const mockUuid = uuidv4();
    wsClient.on('open', function() {
      debug(`wsClient connected to server: ${websocketsServerUrl}`);
      wsClient.on('message', function(data) {
        debug(`wsClient received message: ${data}`);
        expect(data).to.be.an('string');
        expect(data).to.have.string(`Hello ${mockUuid}, message received!`);
        wsClient.close();
        return done();
      });
      wsClient.send(`gui:${mockUuid}`);
    });
  });

  it('should not respond to client message', function(done) {
    wsClient.on('open', function() {
      debug(`wsClient connected to server: ${websocketsServerUrl}`);
      wsClient.on('message', function(data) {
        return done(new Error('Message error!'));
      });
      wsClient.send(chance.word());
      setTimeout(function() {
        wsClient.close();
        return done();
      }, 1000);
    });
  });

  it('should display client data on the dashboard page - server rendered', function(done) {
    const mockUuid = uuidv4();
    const data = chance.word();

    async.series([
      // Send data from client to server via websocket
      function(callback) {
        wsClient.on('open', function() {
          debug(`wsClient connected to server: ${websocketsServerUrl}`);
          wsClient.on('message', function(data) {
            debug(`wsClient received message: ${data}`);
            expect(data).to.be.an('string');
            expect(data).to.have.string(`Hello ${mockUuid}, message received!`);
            wsClient.close();
            return callback();
          });
          wsClient.send(`uuid:${mockUuid}:${data}`);
        });
      },
      // Load the dnashboard and check that data is in the page
      function(callback) {
        const options = {
          url: `http://localhost:${config.server.port}`,
          strictSSL: false
        };
        request(options, function(err, httpResponse, body) {
          if (err) {
            return callback(err);
          }
          const $ = cheerio.load(httpResponse.body);
          expect(parseInt($('.data-item-id')[$('.data-item-id').length - 1].children[0].data)).to.be.gte(0);
          expect($('.data-item-uuid')[$('.data-item-uuid').length - 1].children[0].data).to.equal(`${mockUuid}`);
          expect($('.data-item-data')[$('.data-item-data').length - 1].children[0].data).to.equal(`${data}`);
          return callback();
        });
      }
    ], function(err) {
      if (err) {
        return done(err);
      }
      return done(err);
    });
  });
});
