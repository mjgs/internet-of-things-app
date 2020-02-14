/* eslint-env mocha */
const debug = require('debug')('test:integration:wsServer'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;

describe('#wsServer', function() {
  it('should test that the wsServer integration test suite is setup', function(done) {
    expect(true).to.be.true; // eslint-disable-line no-unused-expressions
    return done();
  });
});
