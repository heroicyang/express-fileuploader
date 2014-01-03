/**
 * express-fileuploader/test/uploader.test.js
 * @author HeroicYang <me@heroicyang.com>
 */

/**
 * Module dependencies
 */
var should = require('should');
var express = require('express');
var mutilpart = require('connect-multiparty');
var request = require('supertest');
var uploader = require('../lib');

describe('uploader.test.js', function() {
  it('Uploader#upload', function(done) {
    var app = express();
    app.use('/upload/image', mutilpart());

    uploader.use(new uploader.LocalStrategy({
      uploadPath: 'test/fixtures/public',
      domain: 'http://127.0.0.1:8000'
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
});