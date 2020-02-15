/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:index'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;

describe('testsuite', function() {
  it('should test that the unit tests suite is setup', function() {
    expect(true).to.be.true;
  });
});
