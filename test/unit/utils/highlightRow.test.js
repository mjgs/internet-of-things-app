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
    const mockDataStore = {
      0: {
        speed: 0
      },
      1: {
        speed: 50
      }
    };
    const stubs = {
      debug: debugFake,
      './dataStore': mockDataStore
    };
    highlightRowUtil = proxyquire('../../../lib/utils/highlightRow', stubs);
  });

  it('should return true for devices that are not moving', function() {
    // setup
    const socketIdMock = 0;

    // run
    const highlightRow = highlightRowUtil(socketIdMock);

    // test
    expect(highlightRow).to.be.true;
    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.args[0][0]).to.be.equal('highlightRow: true');
  });

  it('should return false for devices that are moving', function() {
    // setup
    const socketIdMock = 1;

    // run
    const highlightRow = highlightRowUtil(socketIdMock);

    // test
    expect(highlightRow).to.be.false;
    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.args[0][0]).to.be.equal('highlightRow: false');
  });
});
