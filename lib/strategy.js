/**
 * express-fileuploader/lib/strategy.js
 * @author HeroicYang <me@heroicyang.com>
 */

/**
 * Module dependencies
 */
var util = require('util');

/**
 * Uploader strategy's super constructor
 * @param {String} name  strategy's name
 */
function Strategy(name) {
  this.name = name;
}

/**
 * Upload file
 * Overridden by the implementation strategy
 * @param  {Object}   file
 * @param  {Function} callback
 */
Strategy.prototype.upload = function(file, callback) {
  /* jshint unused:false */
  throw new Error('Strategy#upload must be overridden by subclass');
};

module.exports = exports = Strategy;

/**
 * Inherited from `Strategy`
 *
 * Examples:
 * 
 *     var Strategy = require('express-fileuploader').Strategy;
 *     var QiniuStrategy = Strategy.extend({
 *       name: 'qiniu',
 *       constructor: function(options) {
 *         this.uploadPath = options.uploadPath;
 *         this.options = options.options || {};
 *       },
 *       // overridden upload method
 *       upload: function(file, callback) {}
 *     });
 * 
 * @param  {Object} options
 *  - name    {String}   required    strategy's name
 *  - upload  {Function} required    override upload method
 * @return {Strategy}
 */
exports.extend = function(options) {
  options = options || {};
  var name = options.name;
  delete options.name;
  var ctor = options.constructor;
  delete options.constructor;

  function Ctor() {
    Strategy.call(this, name);
    if (ctor) {
      ctor.apply(this, arguments);
    }
  }
  util.inherits(Ctor, Strategy);

  Object.keys(options)
    .forEach(function(key) {
      Ctor.prototype[key] = options[key];
    });

  return Ctor;
};