/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:middleware'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('#middleware', function() {
  describe('test suite', function() {
    it('should test that the middleware unit test suite is setup', function() {
      expect(true).to.be.true;
    });
  });

  describe('#logRequest', function() {
    it('should log the request', function() {
      // setup
      const req = {
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
      const res = {};
      const next = sinon.fake(test);
      const debugStub = sinon.stub();
      const debugFake = sinon.fake(function(namespace) {
        return debugStub;
      });
      const utilsStub = {
        getRequestInfo: sinon.stub()
      };
      const stubs = {
        debug: debugFake,
        '../utils': utilsStub
      };
      const logRequestMiddleware = proxyquire('../../lib/middleware/logRequest', stubs);

      // run
      logRequestMiddleware(req, res, next);

      // test
      function test(err) {
        expect(err).to.be.undefined;
        expect(utilsStub.getRequestInfo.calledOnce).to.be.true;
        expect(utilsStub.getRequestInfo.calledWith(req)).to.be.true;
        expect(debugStub.calledOnce).to.be.true;
        expect(next.calledOnce).to.be.true;
      }
    });
  });
});
