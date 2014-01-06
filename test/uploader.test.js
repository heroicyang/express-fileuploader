/**
 * express-fileuploader/test/uploader.test.js
 * @author HeroicYang <me@heroicyang.com>
 */

/**
 * Module dependencies
 */
var fs = require('fs');
var should = require('should');
var express = require('express');
var mutilpart = require('connect-multiparty');
var request = require('supertest');
var uploader = require('../lib'),
  Strategy = uploader.Strategy,
  LocalStrategy = uploader.LocalStrategy;

describe('uploader.test.js', function() {
  describe('Uploader#use(name, strategy)', function() {
    it('use strategy', function() {
      uploader.use(new LocalStrategy({
        uploadPath: '/uploads'
      }));
      uploader._strategies.should.have.property('local');
      uploader.unuse('local');
    });

    it('rewrite strategy\'s name', function() {
      uploader.use('localtest', new LocalStrategy({
        uploadPath: '/uploads'
      }));
      uploader._strategies.should.have.property('localtest');
      uploader.unuse('localtest');
    });

    it('no name strategy should throw err', function() {
      var TestStrategy = Strategy.extend({
        upload: function() {}
      });
      try {
        uploader.use(new TestStrategy());
      } catch (e) {
        should.exist(e);
      }
    });
  });

  describe('Uploader#unuse(name)', function() {
    it('unuse strategy by name', function() {
      uploader.use(new LocalStrategy({
        uploadPath: '/uploads'
      }));
      uploader.unuse('local');
      uploader._strategies.should.not.have.property('local');
    });
  });

  describe('Uploader#upload(strategy, files, callback)', function() {
    it('strategy does not exist', function(done) {
      var app = express();
      app.use('/upload/image', mutilpart());

      uploader.use(new uploader.LocalStrategy({
        uploadPath: 'test/fixtures/public',
        baseUrl: 'http://127.0.0.1:8000/public/'
      }));

      app.post('/upload/image', function(req, res) {
        uploader.upload('test', req.files.avatar, function(err, files) {
          if (err) {
            return res.send({
              error: err.message
            });
          }
          res.send(files);
        });
      });

      request(app)
        .post('/upload/image')
        .attach('avatar', 'test/fixtures/heroic.jpg')
        .expect(200)
        .end(function(err, res) {
          should.exist(res.body.error);
          res.body.error.should.contain('no upload strategy');
          done();
        });
    });

    it('one file with one request', function(done) {
      var app = express();
      app.use('/upload/image', mutilpart());

      uploader.use(new uploader.LocalStrategy({
        uploadPath: 'test/fixtures/public',
        baseUrl: 'http://127.0.0.1:8000/public/'
      }));

      app.post('/upload/image', function(req, res) {
        uploader.upload('local', req.files.avatar, function(err, files) {
          if (err) {
            return res.send({
              error: err
            });
          }
          res.send(files);
        });
      });

      request(app)
        .post('/upload/image')
        .attach('avatar', 'test/fixtures/heroic.jpg')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          should.exist(res.body);
          done();
        });
    });

    it('multiple files with one request', function(done) {
      var app = express();
      app.use('/upload/image', mutilpart());

      uploader.use(new uploader.LocalStrategy({
        uploadPath: 'test/fixtures/public',
        baseUrl: 'http://127.0.0.1:8000/public/'
      }));

      app.post('/upload/image', function(req, res) {
        uploader.upload('local', req.files.images, function(err, files) {
          if (err) {
            return res.send({
              error: err
            });
          }
          res.send(files);
        });
      });

      request(app)
        .post('/upload/image')
        .attach('images', 'test/fixtures/heroic.jpg')
        .attach('images', 'test/fixtures/leaf.jpeg')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          should.exist(res.body);
          done();
        });
    });

    it('delete temp files after uploaded', function(done) {
      var app = express();
      app.use('/upload/image', mutilpart());

      uploader.use(new uploader.LocalStrategy({
        uploadPath: 'test/fixtures/public',
        baseUrl: 'http://127.0.0.1:8000/public/'
      }));

      app.post('/upload/image', function(req, res) {
        uploader.upload('local', req.files.avatar, function(err, files) {
          if (err) {
            return res.send({
              error: err
            });
          }
          res.send(files);
        });
      });

      request(app)
        .post('/upload/image')
        .attach('avatar', 'test/fixtures/heroic.jpg')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          should.exist(res.body);
          fs.exists(res.body[0].path, function(exists) {
            exists.should.not.be.ok;
            done();
          });
        });
    });
  });
});