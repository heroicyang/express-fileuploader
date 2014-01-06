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
 *      domain: 'http://127.0.0.1:8080'
 *    }));
 *
 * @param {Object} options
 *  - uploadPath   required
 *  - domain       optional
 * 
 * @return {Strategy}
 */
module.exports = exports = Strategy.extend({
  name: 'local',
  constructor: function(options) {
    options = options || {};
    this.uploadPath = options.uploadPath;
    this.domain = options.domain;

    if (!this.uploadPath) {
      throw new Error('LocalStrategy#uploadPath required.');
    }
  },
  upload: function(file, callback) {
    var uploadPath = path.join(process.cwd(), this.uploadPath),
      newFilePath = path.join(this.uploadPath, file.name);
    var self = this;
    var rename = function() {
      fs.rename(file.path, newFilePath, function(err) {
        if (err) {
          return callback(err);
        }

        if (self.domain) {
          file.url = url.resolve(self.domain, newFilePath);
        }
        
        callback(null, file);
      });
    };

    fs.exists(uploadPath, function(exists) {
      if (!exists) {
        fs.mkdir(uploadPath, function(err) {
          if (err) {
            return callback(err);
          }
          rename();
        });
      } else {
        rename();
      }
    });
  }
});