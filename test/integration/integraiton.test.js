/* eslint-env mocha */
const debug = require('debug')('test:integration:integration'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const request = require('supertest');
const cheerio = require('cheerio');

const app = require('../../lib/app');

describe('#integration', function() {
  it('should test that the integration test suite is setup', function(done) {
    expect(true).to.be.true; // eslint-disable-line no-unused-expressions
    return done();
  });

  it('should load the homepage', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        const $ = cheerio.load(res.text);
        expect($('h1')[0].children[0].data).to.equal('Express');
        expect($('p')[0].children[0].data).to.equal('Welcome to Express');
        return done();
      });
  });

  it('should load the users page', function(done) {
    request(app)
      .get('/users')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        const $ = cheerio.load(res.text);
        expect($('body')[0].children[0].data).to.equal('respond with a resource');
        return done();
      });
  });

  it('should load the 404 error page in development mode', function(done) {
    app.set('env', 'development');
    request(app)
      .get('/pagedoesnotexist')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        app.set('env', 'development');
        return done();
      });
  });

  it('should load the 404 error page in production mode', function(done) {
    app.set('env', 'production');
    request(app)
      .get('/pagedoesnotexist')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        app.set('env', 'development');
        return done();
      });
  });
});
