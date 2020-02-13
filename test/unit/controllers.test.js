/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const debug = require('debug')('test:unit:controllers'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const sinon = require('sinon');

const controllers = require('../../lib/controllers');

describe('#controllers', function() {
  it('should test that the controllers unit test suite is setup', function() {
    expect(true).to.be.true;
  });

  it('should render the homepage', function() {
    // setup
    const req = {};
    const res = {
      render: sinon.stub()
    };
    const next = sinon.stub();

    // run
    controllers.homepage(req, res, next);

    // test
    expect(res.render.calledOnce).to.be.true;
    expect(res.render.calledWith('index', { title: 'Express' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should send users page response', function() {
    // setup
    const req = {};
    const res = {
      send: sinon.stub()
    };
    const next = sinon.stub();

    // run
    controllers.users(req, res, next);

    // test
    expect(res.send.calledOnce).to.be.true;
    expect(res.send.calledWith('respond with a resource')).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should render the dashboard', function() {
    // setup
    const req = {};
    const res = {
      render: sinon.stub()
    };
    const next = sinon.stub();

    // run
    controllers.dashboard(req, res, next);

    // test
    expect(res.render.calledOnce).to.be.true;
    expect(res.render.calledWith('index', { title: 'Dashboard' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});
