/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:utils:verifyMiddlewareParams'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('utils.verifyMiddlewareParams', function() {
  let verifyMiddlewareParamsUtil, debugStub;

  beforeEach(function() {
    debugStub = sinon.stub();
    const debugFake = sinon.fake(function(namespace) {
      return debugStub;
    });
    const stubs = {
      debug: debugFake
    };
    verifyMiddlewareParamsUtil = proxyquire('../../../lib/utils/verifyMiddlewareParams', stubs);
  });

  it('should verify supplied middleware arguments', function() {
    // setup
    const mockReq = {};
    const mockRes = {};
    const mockNext = function() {};

    // run
    verifyMiddlewareParamsUtil(mockReq, mockRes, mockNext);

    // test
    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.args[0][0]).to.be.equal('middleware params are ok');
  });

  it('should throw a req bad argument error', function(done) {
    // setup
    const mockReq = '';
    const mockRes = {};
    const mockNext = function() {};

    // run
    try {
      verifyMiddlewareParamsUtil(mockReq, mockRes, mockNext);
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
    const mockReq = {};
    const mockRes = '';
    const mockNext = function() {};

    // run
    try {
      verifyMiddlewareParamsUtil(mockReq, mockRes, mockNext);
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
    const mockReq = {};
    const mockRes = {};
    const mockNext = '';

    // run
    try {
      verifyMiddlewareParamsUtil(mockReq, mockRes, mockNext);
    }
    catch (err) {
      // test
      expect(err).to.be.an('error');
      expect(err.message).to.equal('Bad argument: next must be a function');
      return done();
    }
  });
});
