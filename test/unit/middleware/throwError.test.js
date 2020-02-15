/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:middleware:throwError'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('middleware.throwError', function() {
  let throwErrorMiddleware, debugStub, utilsStub;

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
    throwErrorMiddleware = proxyquire('../../../lib/middleware/throwError', stubs);
  });

  it('should throw an error', function() {
    // setup
    const mockReq = {};
    const mockRes = {};
    const mockNext = sinon.fake(test);

    // run
    throwErrorMiddleware(mockReq, mockRes, mockNext);

    // test
    function test(err) {
      expect(err).to.be.an('error');
      expect(err.message).to.be.equal('throwing an error!');
    }
  });
});
