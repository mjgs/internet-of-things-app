/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:utils'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const chance = new (require('chance'))();

describe('#utils', function() {
  describe('test suite', function() {
    it('should test that the utils unit test suite is setup', function() {
      expect(true).to.be.true;
    });
  });

  describe('#createWebsocketServer', function() {
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
      createWebsocketsServer = proxyquire('../../lib/utils/createWebsocketsServer', stubs);
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

  describe('#getRequestInfo', function() {
    let getRequestInfoUtil, debugStub;

    const mockReqFixture = {
      baseUrl: '',
      body: {},
      cookies: {},
      fresh: false,
      headers: {},
      hostname: 'localhost',
      ip: '127.0.0.1',
      ips: [],
      method: 'GET',
      originalUrl: '/',
      params: {},
      path: '/',
      protocol: 'http',
      query: {},
      route: {},
      secure: false,
      signedCookies: {},
      stale: true,
      subdomains: [],
      xhr: false
    };

    beforeEach(function() {
      debugStub = sinon.stub();
      const debugFake = sinon.fake(function(namespace) {
        return debugStub;
      });
      const stubs = {
        debug: debugFake
      };
      getRequestInfoUtil = proxyquire('../../lib/utils/getRequestInfo', stubs);
    });

    it('should get the request info', function() {
      // setup
      const mockReq = Object.assign({}, mockReqFixture);

      // run
      const reqInfo = getRequestInfoUtil(mockReq);

      // test
      expect(reqInfo).to.be.an('object');
      expect(Object.keys(reqInfo)).to.have.length(20);
    });

    it('should throw a bad argument error', function(done) {
      // setup
      const mockReq = '';
      let reqInfo;

      // run
      try {
        reqInfo = getRequestInfoUtil(mockReq);
      }
      catch (err) {
      // test
        expect(err).to.be.an('error');
        expect(reqInfo).to.be.undefined;
        expect(err.message).to.equal('Bad argument: req must be an object');
        return done();
      }
    });
  });
});
