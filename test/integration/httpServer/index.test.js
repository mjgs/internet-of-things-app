/* eslint-env mocha */
const debug = require('debug')('test:integration:httpServer:index'); // eslint-disable-line no-unused-vars

const expect = require('chai').expect;
const request = require('supertest');
const cheerio = require('cheerio');

describe('httpServer: index', function() {
  let app;

  beforeEach(function(done) {
    app = require('../../../lib/app');
    return done();
  });

  afterEach(function() {
    process.env.NODE_ENV = 'test';
    delete require.cache[require.resolve('../../../lib/app')]; // clear module from require cache
  });

  it('should load the 404 error page in development mode', function(done) {
    process.env.NODE_ENV = 'development';
    delete require.cache[require.resolve('../../../lib/app')]; // clear module from require cache
    app = require('../../../lib/app'); // reload module so env gets set
    request(app)
      .get('/pagedoesnotexist')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should load the 404 error page in production mode', function(done) {
    process.env.NODE_ENV = 'production';
    delete require.cache[require.resolve('../../../lib/app')]; // clear module from require cache
    app = require('../../../lib/app'); // reload module so env gets set
    request(app)
      .get('/pagedoesnotexist')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should load the 500 error', function(done) {
    delete require.cache[require.resolve('../../../lib/app')]; // clear module from require cache
    app = require('../../../lib/app'); // reload module so env gets set
    request(app)
      .get('/throwError')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(500)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        const $ = cheerio.load(res.text);
        expect($('h1')[0].children[0].data).to.equal('throwing an error!');
        return done();
      });
  });
});
