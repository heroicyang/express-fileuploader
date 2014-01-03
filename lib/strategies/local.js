/**
 * express-fileuploader/lib/strategies/local.js
 * @author HeroicYang <me@heroicyang.com>
 */

/**
 * Module dependencies
 */
var fs = require('fs'),
  path = require('path');
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
 * @return {Strategy}
 */
module.exports = exports = Strategy.extend({
  name: 'local',
  constructor: function(options) {
    options = options || {};
    this.uploadPath = options.uploadPath;
    this.domain = options.domain;
  },
  upload: function(file, callback) {
    var newPath = path.join(this.uploadPath, file.name);
    var self = this;
    fs.rename(file.path, newPath, function(err) {
      if (err) { return callback(err); }
      file.url = self.domain + '/' + newPath;
      callback(null, file);
    });
  }
});