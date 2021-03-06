/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:middleware:logRequest'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('middleware.logRequest', function() {
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

  let logRequestMiddleware, debugStub, utilsStub;

  beforeEach(function() {
    debugStub = sinon.stub();
    const debugFake = sinon.fake(function(namespace) {
      return debugStub;
    });
    utilsStub = {
      getRequestInfo: sinon.stub()
    };
    const stubs = {
      debug: debugFake,
      '../utils': utilsStub
    };
    logRequestMiddleware = proxyquire('../../../lib/middleware/logRequest', stubs);
  });

  it('should log the request', function() {
    // setup
    const mockReq = Object.assign({}, mockReqFixture);
    const mockRes = {};
    const mockNext = sinon.fake(test);

    // run
    logRequestMiddleware(mockReq, mockRes, mockNext);

    // test
    function test(err) {
      expect(err).to.be.undefined;
      expect(utilsStub.getRequestInfo.calledOnce).to.be.true;
      expect(utilsStub.getRequestInfo.calledWith(mockReq)).to.be.true;
      expect(debugStub.calledOnce).to.be.true;
      expect(mockNext.calledOnce).to.be.true;
    }
  });

  it('should throw a req bad argument error', function(done) {
    // setup
    const mockReq = '';
    const mockRes = {};
    const mockNext = function() {};

    // run
    try {
      logRequestMiddleware(mockReq, mockRes, mockNext);
    }
    catch (err) {
    // test
      expect(err).to.be.an('error');
      expect(err.message).to.equal('Bad argument: req must be an object');
      return done();
    }
  });

  it('should throw a res bad argument error', function(done) {
    // setup
    const mockReq = Object.assign({}, mockReqFixture);
    const mockRes = '';
    const mockNext = function() {};

    // run
    try {
      logRequestMiddleware(mockReq, mockRes, mockNext);
    }
    catch (err) {
    // test
      expect(err).to.be.an('error');
      expect(err.message).to.equal('Bad argument: res must be an object');
      return done();
    }
  });

  it('should throw a next bad argument error', function(done) {
    // setup
    const mockReq = Object.assign({}, mockReqFixture);
    const mockRes = {};
    const mockNext = '';

    // run
    try {
      logRequestMiddleware(mockReq, mockRes, mockNext);
    }
    catch (err) {
    // test
      expect(err).to.be.an('error');
      expect(err.message).to.equal('Bad argument: next must be a function');
      return done();
    }
  });
});
