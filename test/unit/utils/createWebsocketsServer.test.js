/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:utils:createWebsocketsServer'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chance = new (require('chance'))();

describe('utils.createWebsocketsServer', function() {
  let createWebsocketsServer, debugStub, mockMessage, clientSocketMock, clientSocketOnStub;
  let wsServerOnStub, WebSocketStub, clientSocketSendStub;

  beforeEach(function() {
    debugStub = sinon.stub();
    const debugFake = sinon.fake(function(namespace) {
      return debugStub;
    });
    mockMessage = chance.word();
    clientSocketOnStub = sinon.spy(function(event, cb) {
      return cb(mockMessage);
    });
    clientSocketSendStub = sinon.stub();
    clientSocketMock = {
      on: clientSocketOnStub,
      send: clientSocketSendStub
    };
    wsServerOnStub = sinon.spy(function(event, cb) {
      return cb(clientSocketMock);
    });
    WebSocketStub = {
      Server: class WebSocket {
        constructor() {
          return {
            on: wsServerOnStub
          };
        }
      }
    };
    const stubs = {
      debug: debugFake,
      ws: WebSocketStub
    };
    createWebsocketsServer = proxyquire('../../../lib/utils/createWebsocketsServer', stubs);
  });

  it('should create a web sockets server', function() {
    // setup
    const mockServer = {};

    // run
    const wss = createWebsocketsServer(mockServer);

    // test
    expect(wss).to.be.an('object');
    expect(wsServerOnStub.calledOnce).to.be.true;
    expect(clientSocketOnStub.calledOnce).to.be.true;
    expect(debugStub.calledTwice).to.be.true;
    expect(debugStub.args[0][0]).to.be.equal(`wsServer received message: ${mockMessage}`);
    expect(clientSocketSendStub.calledOnce).to.be.true;
    expect(clientSocketSendStub.args[0][0]).to.have.string('PONG from server - ');
    expect(debugStub.args[1][0]).to.have.string('wsServer sent message: PONG from server -');
  });

  it('should throw a bad argument error', function(done) {
    // setup
    const mockServer = '';

    // run
    try {
      createWebsocketsServer(mockServer);
    }
    catch (err) {
    // test
      expect(err).to.be.an('error');
      expect(err.message).to.equal('Bad argument: server must be an object');
      return done();
    }
  });
});
