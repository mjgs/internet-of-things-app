/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:controllers:dashboard'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('controllers.dashboard', function() {
  let dashboardController, debugStub, utilsStub;

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
    dashboardController = proxyquire('../../../lib/controllers/dashboard', stubs);
  });

  it('should render the dashboard', function() {
    // setup
    const mockReq = {};
    const mockRes = {
      render: sinon.stub()
    };
    const mockNext = sinon.stub();

    // run
    dashboardController(mockReq, mockRes, mockNext);

    // test
    expect(mockRes.render.calledOnce).to.be.true;
    expect(mockRes.render.calledWith('index', { title: 'Dashboard' })).to.be.true;
    expect(mockNext.notCalled).to.be.true;
  });

  it('should throw a req bad argument error', function(done) {
    // setup
    const mockReq = '';
    const mockRes = {};
    const mockNext = function() {};

    // run
    try {
      dashboardController(mockReq, mockRes, mockNext);
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
      dashboardController(mockReq, mockRes, mockNext);
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
      dashboardController(mockReq, mockRes, mockNext);
    }
    catch (err) {
    // test
      expect(err).to.be.an('error');
      expect(err.message).to.equal('Bad argument: next must be a function');
      return done();
    }
  });
});
