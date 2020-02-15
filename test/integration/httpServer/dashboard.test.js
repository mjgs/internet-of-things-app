/* eslint-env mocha */
const debug = require('debug')('test:integration:httpServer:dashboard'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const request = require('supertest');
const cheerio = require('cheerio');

describe('httpServer: dashboard', function() {
  let app;

  beforeEach(function(done) {
    app = require('../../../lib/app');
    return done();
  });

  afterEach(function() {
    process.env.NODE_ENV = 'test';
    delete require.cache[require.resolve('../../../lib/app')]; // clear module from require cache
  });

  it('should load the dashboard page', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        const $ = cheerio.load(res.text);
        expect($('h1')[0].children[0].data).to.equal('Dashboard');
        expect($('p')[0].children[0].data).to.equal('Welcome to Dashboard');
        return done();
      });
  });

  it('should load the dashboard page in development mode', function(done) {
    process.env.NODE_ENV = 'development';
    delete require.cache[require.resolve('../../../lib/app')]; // clear module from require cache
    app = require('../../../lib/app'); // reload module so env gets set
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        const $ = cheerio.load(res.text);
        expect($('h1')[0].children[0].data).to.equal('Dashboard');
        expect($('p')[0].children[0].data).to.equal('Welcome to Dashboard');
        return done();
      });
  });
});
