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
const dataStore = require('../../../lib/utils/dataStore');

describe('wsServer: index', function() {
  let httpServer, wsClient, wsServer, websocketsServerUrl;

  beforeEach(function(done) {
    httpServer = http.createServer(app);
    wsServer = createWebsocketsServer(httpServer);
    httpServer.listen(config.server.port, function(err) {
      if (err) {
        return done(err);
      }
      debug(`wsServer listening on port: ${config.server.port}`);
      websocketsServerUrl = `ws://localhost:${config.server.port}/`;
      wsClient = new WebSocket(websocketsServerUrl);
      debug(`created web sockets client connection to wss: ${websocketsServerUrl}`);
      return done();
    });
  });

  afterEach(function(done) {
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
        dataStore.clearDataStore();
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
    const mockLat = '50.1234';
    const mockLong = '55.1234';
    wsClient.on('open', function() {
      debug(`wsClient connected to server: ${websocketsServerUrl}`);
      wsClient.on('message', function(data) {
        debug(`wsClient received message: ${data}`);
        expect(data).to.be.an('string');
        expect(data).to.have.string(`Hello ${mockUuid}, message received!`);
        wsClient.close();
        return done();
      });
      wsClient.send(`uuid:${mockUuid}:${mockLat}:${mockLong}`);
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

  it('should not respond to bad client message', function(done) {
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

  it('should not respond to bad uuid client message', function(done) {
    wsClient.on('open', function() {
      debug(`wsClient connected to server: ${websocketsServerUrl}`);
      wsClient.on('message', function(data) {
        return done(new Error('Message error!'));
      });
      wsClient.send(`uuid:${chance.word()}:${chance.word()}:${chance.word()}`);
      setTimeout(function() {
        wsClient.close();
        return done();
      }, 1000);
    });
  });

  it('should display client data on the dashboard page - server rendered, zero speed', function(done) {
    const mockUuid = uuidv4();
    const mockLat = '50.1234';
    const mockLong = '55.1234';

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
          wsClient.send(`uuid:${mockUuid}:${mockLat}:${mockLong}`);
        });
      },
      // Load the dashboard and check that data is in the page
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
          expect($('.data-item-lat')[$('.data-item-lat').length - 1].children[0].data).to.equal(`${mockLat}`);
          expect($('.data-item-long')[$('.data-item-long').length - 1].children[0].data).to.equal(`${mockLong}`);
          expect(parseInt($('.data-item-speed')[$('.data-item-speed').length - 1].children[0].data)).to.equal(0);
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

  it('should display client data on the dashboard page - server rendered, non-zero speed', function(done) {
    const mockUuid = uuidv4();
    const mockLat1 = '50.1234';
    const mockLong1 = '55.1234';
    const mockLat2 = '50.1235';
    const mockLong2 = '55.1235';

    let ctr = 0;

    async.series([
      // Send 2 data packets from client to server via websocket
      function(callback) {
        wsClient.on('open', function() {
          debug(`wsClient connected to server: ${websocketsServerUrl}`);
          wsClient.on('message', function(data) {
            debug(`wsClient received message: ${data}`);
            expect(data).to.be.an('string');
            if (ctr === 1) {
              wsClient.close();
              return callback();
            }
            ctr++;
          });
          wsClient.send(`uuid:${mockUuid}:${mockLat1}:${mockLong1}`);
          // Wait 1 sec so the timestamps are different
          setTimeout(function() {
            wsClient.send(`uuid:${mockUuid}:${mockLat2}:${mockLong2}`);
          }, 1000);
        });
      },
      // Load the dashboard and check that data is in the page
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
          expect($('.data-item-lat')[$('.data-item-lat').length - 1].children[0].data).to.equal(`${mockLat2}`);
          expect($('.data-item-long')[$('.data-item-long').length - 1].children[0].data).to.equal(`${mockLong2}`);
          expect(parseInt($('.data-item-speed')[$('.data-item-speed').length - 1].children[0].data)).to.be.gt(0);
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
