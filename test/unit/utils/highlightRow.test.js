/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:utils:highlightRow'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('utils.highlightRow', function() {
  let highlightRowUtil, debugStub;

  beforeEach(function() {
    debugStub = sinon.stub();
    const debugFake = sinon.fake(function(namespace) {
      return debugStub;
    });
    const stubs = {
      debug: debugFake
    };
    highlightRowUtil = proxyquire('../../../lib/utils/highlightRow', stubs);
  });

  it('should return a boolean value', function() {
    // setup
    const mockReq = {};
    const mockRes = {};
    const mockNext = function() {};

    // run
    const highlightRow = highlightRowUtil(mockReq, mockRes, mockNext);

    // test
    expect(highlightRow).to.be.an('boolean');
    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.args[0][0]).to.be.equal(`highlightRow: ${highlightRow}`);
  });
});
