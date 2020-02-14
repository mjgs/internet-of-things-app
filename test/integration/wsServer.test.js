/* eslint-env mocha */
const debug = require('debug')('test:integration:wsServer'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const http = require('http');

const app = require('../../lib/app');
const config = require('../../lib/config');
const wsServer = require('../../lib/utils/wsServer');

describe('#wsServer', function() {
  let server;

  before(function(done) {
    server = http.createServer(app);
    wsServer(server);

    server.listen(config.server.port, function(err) {
      if (err) {
        return done(err);
      }
      debug(`wsServer listening on port: ${config.server.port}`);
      return done();
    });
  });

  after(function(done) {
    if (server) {
      server.on('close', function() {
        debug('Closed wsServer');
        return done();
      });
      server.close(function() {
        debug('Initiated close of wsServer...');
        server.unref();
      });
    }
    else {
      return done(new Error('Problem closing the wsServer'));
    }
  });

  it('should test that the wsServer integration test suite is setup', function(done) {
    expect(true).to.be.true; // eslint-disable-line no-unused-expressions
    return done();
  });
});
