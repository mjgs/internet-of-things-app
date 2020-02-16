/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:utils:createWebsocketsServer'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('utils.createWebsocketsServer', function() {
  it('should create a web sockets server', function() {
    // setup
    const debugStub = sinon.stub();
    const debugFake = sinon.fake(function(namespace) {
      return debugStub;
    });
    const wsServerOnStub = sinon.stub();
    const WebSocketStub = {
      Server: sinon.spy(class WebSocket {
        constructor() {
          return {
            on: wsServerOnStub
          };
        }
      })
    };
    const stubs = {
      debug: debugFake,
      ws: WebSocketStub
    };
    const createWebsocketsServerUtil = proxyquire('../../../lib/utils/createWebsocketsServer', stubs);
    const mockServer = {};

    // run
    const wss = createWebsocketsServerUtil(mockServer);

    // test
    expect(wss).to.be.an('object');
    expect(WebSocketStub.Server.calledOnce).to.be.true;
    expect(WebSocketStub.Server.calledWith({ server: mockServer })).to.be.true;
    expect(wsServerOnStub.calledOnce).to.be.true;
  });

  it('should throw a bad argument error', function(done) {
    // setup
    const debugStub = sinon.stub();
    const debugFake = sinon.fake(function(namespace) {
      return debugStub;
    });
    const WebSocketStub = {};
    const stubs = {
      debug: debugFake,
      ws: WebSocketStub
    };
    const createWebsocketsServerUtil = proxyquire('../../../lib/utils/createWebsocketsServer', stubs);
    const mockServer = '';

    // run
    try {
      createWebsocketsServerUtil(mockServer);
    }
    catch (err) {
    // test
      expect(err).to.be.an('error');
      expect(err.message).to.equal('Bad argument: server must be an object');
      return done();
    }
  });
});
