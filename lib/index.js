/**
 * express-fileuploader/lib/index.js
 * @author HeroicYang <me@heroicyang.com>
 */

/**
 * Module dependencies
 */
var util = require('util'),
  path = require('path'),
  fs = require('fs');
var uuid = require('node-uuid');
var Strategy = require('./strategy'),
  LocalStrategy = require('./strategies/local');

module.exports = exports = new Uploader();
exports.Uploader = Uploader;
exports.Strategy = Strategy;
exports.LocalStrategy = LocalStrategy;


/**
 * Uploader constructor
 */
function Uploader() {
  this._strategies = {};
}

/**
 * Utilize the given `strategy` with optional `name`, overridding the strategy's default name.
 *
 * Examples:
 *
 *    uploader.use(new LocalStrategy());
 *    uploader.use('local', new LocalStrategy());
 *
 * @param  {String|Object}  name     strategy's name
 * @param  {Strategy}       strategy
 * @return {Uploader}
 */
Uploader.prototype.use = function(name, strategy) {
  if (!strategy) {
    strategy = name;
    name = strategy.name;
  }

  if (!name) {
    throw new Error('Uploader strategies must be have a name');
  }

  this._strategies[name] = strategy;
  return this;
};

/**
 * Un-utilize the `strategy` with given `name`.
 *
 * Examples:
 *
 *    uploader.unuse('local');
 *
 * @param  {String} name  strategy's name
 * @return {Uploader}
 */
Uploader.prototype.unuse = function(name) {
  delete this._strategies[name];
  return this;
};

/**
 * Using the specified strategy to upload files
 * @param  {String}   strategy  strategy's name
 * @param  {Object}   files     req.files
 * @param  {Function} callback
 *  - err
 *  - files
 */
Uploader.prototype.upload = function(strategy, files, callback) {
  var name = strategy;
  strategy = this._strategies[name];
  if (!strategy) {
    return callback(new Error('no upload strategy: ' + name));
  }

  if (!util.isArray(files)) {
    files = [files];
  }

  var fileCount = files.length;
  files.forEach(function(file) {
    var uid = uuid.v1(),
      ext = path.extname(file.name);
    file.name = uid + ext;

    strategy.upload(file, function(err, fileUploaded) {
      if (err) {
        file.error = err;
      }

      if (fileUploaded) {
        Object.keys(fileUploaded)
          .forEach(function(key) {
            if (!file[key]) {
              file[key] = fileUploaded[key];
            }
          });
      }

      fs.unlink(file.path, function(err) {
        /* jshint unused:false */
        fileCount -= 1;
        if (fileCount === 0) {
          callback(null, files);
        }
      });
    });
  });
};
