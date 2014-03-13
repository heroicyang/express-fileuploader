/**
 * express-fileuploader/lib/strategies/local.js
 * @author HeroicYang <me@heroicyang.com>
 */

/**
 * Module dependencies
 */
var fs = require('fs'),
  path = require('path'),
  url = require('url');
var Strategy = require('../strategy');

/**
 * LocalStrategy
 * Copy file to another directory.
 *
 * Examples:
 *
 *    var uploader = require('express-fileuploader');
 *    var LocalStrategy = uploader.LocalStrategy;
 *
 *    uploader.use(new LocalStrategy({
 *      uploadPath: '/uploads',
 *      baseUrl: 'http://127.0.0.1:8080'
 *    }));
 *
 * @param {Object} options
 *  - uploadPath   required
 *  - baseUrl       optional
 *
 * @return {Strategy}
 */
module.exports = exports = Strategy.extend({
  name: 'local',
  constructor: function(options) {
    options = options || {};
    this.uploadPath = options.uploadPath;
    this.baseUrl = options.baseUrl;

    if (!this.uploadPath) {
      throw new Error('LocalStrategy#uploadPath required.');
    }
  },
  upload: function(file, callback) {
    var uploadPath = path.join(process.cwd(), this.uploadPath),
      dest = path.join(uploadPath, file.name);
    var self = this;

    var rename = function() {
      fs.rename(file.path, dest, function(err) {
        if (err) {
          return callback(err);
        }

        if (self.baseUrl) {
          if (self.baseUrl[self.baseUrl.length - 1] !== '/') {
            self.baseUrl = self.baseUrl + '/';
          }
          file.url = url.resolve(self.baseUrl, file.name);
        }

        callback(null, file);
      });
    };

    var mkdirp = function(dirPath, callback) {
      fs.exists(dirPath, function(exists) {
        if (exists) {
          return callback();
        } else {
          mkdirp(path.dirname(dirPath), function() {
            fs.mkdir(dirPath, callback);
          });
        }
      });
    };

    mkdirp(uploadPath, function(err) {
      if (err) {
        return callback(err);
      }
      rename();
    });
  }
});
