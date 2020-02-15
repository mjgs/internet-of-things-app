/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:utils:getRequestInfo'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('utils.getRequestInfo', function() {
  let getRequestInfoUtil, debugStub;

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

  beforeEach(function() {
    debugStub = sinon.stub();
    const debugFake = sinon.fake(function(namespace) {
      return debugStub;
    });
    const stubs = {
      debug: debugFake
    };
    getRequestInfoUtil = proxyquire('../../../lib/utils/getRequestInfo', stubs);
  });

  it('should get the request info', function() {
    // setup
    const mockReq = Object.assign({}, mockReqFixture);

    // run
    const reqInfo = getRequestInfoUtil(mockReq);

    // test
    expect(reqInfo).to.be.an('object');
    expect(Object.keys(reqInfo)).to.have.length(20);
  });

  it('should throw a bad argument error', function(done) {
    // setup
    const mockReq = '';
    let reqInfo;

    // run
    try {
      reqInfo = getRequestInfoUtil(mockReq);
    }
    catch (err) {
    // test
      expect(err).to.be.an('error');
      expect(reqInfo).to.be.undefined;
      expect(err.message).to.equal('Bad argument: req must be an object');
      return done();
    }
  });
});
