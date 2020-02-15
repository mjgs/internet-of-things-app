/* eslint-env mocha */
const debug = require('debug')('test:integration:index'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;

describe('testsuite', function() {
  it('should test that the integration tests suite is setup', function(done) {
    expect(true).to.be.true; // eslint-disable-line no-unused-expressions
    return done();
  });
});
