/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:utils:calculateSpeed'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('utils.calculateSpeed', function() {
  let calculateSpeedUtil, debugStub;

  beforeEach(function() {
    debugStub = sinon.stub();
    const debugFake = sinon.fake(function(namespace) {
      return debugStub;
    });
    const stubs = {
      debug: debugFake
    };
    calculateSpeedUtil = proxyquire('../../../lib/utils/calculateSpeed', stubs);
  });

  it('should return a number betwee 0 and 100', function() {
    // setup
    const mockReq = {};
    const mockRes = {};
    const mockNext = function() {};

    // run
    const speed = calculateSpeedUtil(mockReq, mockRes, mockNext);

    // test
    expect(speed).to.be.above(-1);
    expect(speed).to.be.below(101);
    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.args[0][0]).has.string('speed:');
    expect(debugStub.args[0][0]).has.string('km/h');
  });
});
