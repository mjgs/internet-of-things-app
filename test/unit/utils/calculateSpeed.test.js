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

  it('should return a positive number', function() {
    // setup
    const t2 = Date.now();
    const t1 = t2 - (10 * 1000);
    const lat1 = 50.1234;
    const long1 = 55.1234;
    const lat2 = 55.1234;
    const long2 = 60.1234;

    // run
    const speed = calculateSpeedUtil(t1, lat1, long1, t2, lat2, long2);

    // test
    expect(speed).to.be.above(-1);
    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.args[0][0]).has.string('speed:');
    expect(debugStub.args[0][0]).has.string('meters/second');
  });

  it('should return null - bad t2', function() {
    // setup
    const t2 = -1;
    const t1 = Date.now() - (10 * 1000);
    const lat1 = '50.1234';
    const long1 = '55.1234';
    const lat2 = '55.1234';
    const long2 = '60.1234';

    // run
    const speed = calculateSpeedUtil(t1, lat1, long1, t2, lat2, long2);

    // test
    expect(speed).to.be.null;
    expect(debugStub.notCalled).to.be.true;
  });

  it('should return null - bad t1', function() {
    // setup
    const t2 = Date.now();
    const t1 = -1;
    const lat1 = '50.1234';
    const long1 = '55.1234';
    const lat2 = '55.1234';
    const long2 = '60.1234';

    // run
    const speed = calculateSpeedUtil(t1, lat1, long1, t2, lat2, long2);

    // test
    expect(speed).to.be.null;
    expect(debugStub.notCalled).to.be.true;
  });

  it('should return null - bad timestamps', function() {
    // setup
    const t2 = Date.now();
    const t1 = Date.now() + (10 * 1000);
    const lat1 = '50.1234';
    const long1 = '55.1234';
    const lat2 = '55.1234';
    const long2 = 'qwerty';

    // run
    const speed = calculateSpeedUtil(t1, lat1, long1, t2, lat2, long2);

    // test
    expect(speed).to.be.null;
    expect(debugStub.notCalled).to.be.true;
  });

  it('should return null - bad lat1', function() {
    // setup
    const t2 = Date.now();
    const t1 = Date.now() - (10 * 1000);
    const lat1 = 'qwerty';
    const long1 = '55.1234';
    const lat2 = '55.1234';
    const long2 = '60.1234';

    // run
    const speed = calculateSpeedUtil(t1, lat1, long1, t2, lat2, long2);

    // test
    expect(speed).to.be.null;
    expect(debugStub.notCalled).to.be.true;
  });

  it('should return null - bad long1', function() {
    // setup
    const t2 = Date.now();
    const t1 = Date.now() - (10 * 1000);
    const lat1 = '50.1234';
    const long1 = 'qwerty';
    const lat2 = '55.1234';
    const long2 = '60.1234';

    // run
    const speed = calculateSpeedUtil(t1, lat1, long1, t2, lat2, long2);

    // test
    expect(speed).to.be.null;
    expect(debugStub.notCalled).to.be.true;
  });
  it('should return null - bad lat2', function() {
    // setup
    const t2 = Date.now();
    const t1 = Date.now() - (10 * 1000);
    const lat1 = '50.1234';
    const long1 = '55.1234';
    const lat2 = 'qwerty';
    const long2 = '60.1234';

    // run
    const speed = calculateSpeedUtil(t1, lat1, long1, t2, lat2, long2);

    // test
    expect(speed).to.be.null;
    expect(debugStub.notCalled).to.be.true;
  });

  it('should return null - bad long2', function() {
    // setup
    const t2 = Date.now();
    const t1 = Date.now() - (10 * 1000);
    const lat1 = '50.1234';
    const long1 = '55.1234';
    const lat2 = '55.1234';
    const long2 = 'qwerty';

    // run
    const speed = calculateSpeedUtil(t1, lat1, long1, t2, lat2, long2);

    // test
    expect(speed).to.be.null;
    expect(debugStub.notCalled).to.be.true;
  });
});
