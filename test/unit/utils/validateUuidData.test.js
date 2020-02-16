/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:utils:validateUuidData'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const uuidv4 = require('uuid/v4');
const validator = require('validator');
const chance = new (require('chance'))();

describe('utils.validateUuidData', function() {
  let validateUuidDataUtil, debugStub;

  beforeEach(function() {
    debugStub = sinon.stub();
    const debugFake = sinon.fake(function(namespace) {
      return debugStub;
    });
    const stubs = {
      debug: debugFake
    };
    validateUuidDataUtil = proxyquire('../../../lib/utils/validateUuidData', stubs);
  });

  it('should return true', function() {
    // setup
    const mockUuid = uuidv4();
    const mockLat = '50.1234';
    const mockLong = '55.1234';
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.an('object');
    expect(Object.keys(validated)).to.have.length(3);
    expect(validator.isUUID(validated.uuid, 4)).to.be.true;
    expect(validated.uuid).to.be.equal(mockUuid);
    expect(validated.lat).to.be.an('number');
    expect(validated.lat).to.be.equal(parseFloat(mockLat));
    expect(validated.long).to.be.an('number');
    expect(validated.long).to.be.equal(parseFloat(mockLong));
    expect(debugStub.calledOnce).to.be.true;
    expect(debugStub.args[0][0]).have.string('validated: ');
  });

  it('should return false - empty string', function() {
    // setup
    const mockData = '';

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - object', function() {
    // setup
    const mockData = {};

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - null', function() {
    // setup
    const mockData = null;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - function', function() {
    // setup
    const mockData = function() {};

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - bad prefix', function() {
    // setup
    let mockPrefix;
    while (mockPrefix === 'uuid') {
      mockPrefix = chance.word();
    }

    const mockUuid = uuidv4();
    const mockLat = '50.1234';
    const mockLong = '55.1234';
    const mockData = `${mockPrefix}:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - bad uuid', function() {
    // setup
    let mockUuid = chance.word();
    while (validator.isUUID(mockUuid)) {
      mockUuid = chance.word();
    }
    const mockLat = '50.1234';
    const mockLong = '55.1234';
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - empty string lat', function() {
    // setup
    const mockUuid = uuidv4();
    const mockLat = '';
    const mockLong = '55.1234';
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - empty string long', function() {
    // setup
    const mockUuid = uuidv4();
    const mockLat = '50.1234';
    const mockLong = '';
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - null lat', function() {
    // setup
    const mockUuid = uuidv4();
    const mockLat = null;
    const mockLong = '55.1234';
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - null long', function() {
    // setup
    const mockUuid = uuidv4();
    const mockLat = '50.1234';
    const mockLong = null;
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - object lat', function() {
    // setup
    const mockUuid = uuidv4();
    const mockLat = {};
    const mockLong = '55.1234';
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - object long', function() {
    // setup
    const mockUuid = uuidv4();
    const mockLat = '50.1234';
    const mockLong = {};
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - bad lat', function() {
    // setup
    const mockUuid = uuidv4();
    const mockLat = 'qwerty';
    const mockLong = '55.1234';
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });

  it('should return false - bad long', function() {
    // setup
    const mockUuid = uuidv4();
    const mockLat = '50.1234';
    const mockLong = 'uiop';
    const mockData = `uuid:${mockUuid}:${mockLat}:${mockLong}`;

    // run
    const validated = validateUuidDataUtil(mockData);

    // test
    expect(validated).to.be.false;
  });
});
