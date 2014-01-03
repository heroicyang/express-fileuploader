/**
 * express-fileuploader/test/strategy.test.js
 * @author HeroicYang <me@heroicyang.com>
 */

/**
 * Module dependencies
 */
var should = require('should');
var Strategy = require('../lib/strategy');

describe('strategy.test.js', function() {
  describe('Strategy.extend(options)', function() {
    it('Strategy#upload does not override should throw error', function() {
      var TestStrategy = Strategy.extend({
        name: 'test'
      });
      var test = new TestStrategy();
      test.upload.should.throwError();
    });

    it('define strategy\'s constructor', function() {
      var TestStrategy = Strategy.extend({
        name: 'test',
        constructor: function(options) {
          options = options || {};
          this.uploadPath = options.uploadPath;
        },
        upload: function(file, callback) {
          console.dir(file);
          callback(null);
        }
      });
      var test = new TestStrategy({
        uploadPath: '/uploads'
      });
      should.exist(test.uploadPath);
    });

    it('override Strategy#upload', function(done) {
      var TestStrategy = Strategy.extend({
        name: 'test',
        constructor: function(options) {
          options = options || {};
          this.uploadPath = options.uploadPath;
        },
        upload: function(file, callback) {
          var self = this;
          setTimeout(function() {
            file.url = self.uploadPath + '/' + file.name;
            callback(null, file);
          }, 0);
        }
      });
      var test = new TestStrategy({
        uploadPath: '/uploads'
      });
      test.upload({
        name: 'test.jpg'
      }, function(err, file) {
        should.not.exist(err);
        should.exist(file);
        file.url.should.eql('/uploads/' + file.name);
        done();
      });
    });
  });
});