/**
 * express-fileuploader/test/local_strategy.test.js
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
var uploader = require('../lib');
var LocalStrategy = require('../lib/strategies/local');

describe('local_strategy.test.js', function() {
  it('LocalStrategy#uploadPath required', function() {
    try {
      var strategy = new LocalStrategy();
    } catch (e) {
      should.exist(e);
    }
  });

  describe('LocalStrategy#upload(file, callback)', function() {
    it('if directory does not exist should create before rename file', function(done) {
      var app = express();
      app.use('/upload/image', mutilpart());

      uploader.use(new uploader.LocalStrategy({
        uploadPath: 'test/fixtures/uploads'
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

      if (fs.existsSync('test/fixtures/uploads')) {
        fs.readdirSync('test/fixtures/uploads')
          .forEach(function(file) {
            fs.unlinkSync('test/fixtures/uploads/' + file);
          });
        fs.rmdirSync('test/fixtures/uploads');
      }

      request(app)
        .post('/upload/image')
        .attach('avatar', 'test/fixtures/heroic.jpg')
        .expect(200)
        .end(function(err) {
          if (err) {
            return done(err);
          }
          fs.exists('test/fixtures/uploads', function(exists) {
            exists.should.be.ok;
            done();
          });
        });
    });
  });
});