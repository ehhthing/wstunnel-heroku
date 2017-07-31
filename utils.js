// Generated by CoffeeScript 1.6.3
(function() {
  var util, _logging_level;

  util = require('util');

  exports.parseArgs = function() {
    var defination, lastKey, nextIsValue, oneArg, result, _, _ref;
    defination = {
      '-l': 'local_port',
      '-p': 'server_port',
      '-s': 'server',
      '-k': 'password',
      '-c': 'config_file',
      '-m': 'method'
    };
    result = {};
    nextIsValue = false;
    lastKey = null;
    _ref = process.argv;
    for (_ in _ref) {
      oneArg = _ref[_];
      if (nextIsValue) {
        result[lastKey] = oneArg;
        nextIsValue = false;
      } else if (oneArg in defination) {
        lastKey = defination[oneArg];
        nextIsValue = true;
      } else if ('-v' === oneArg) {
        result['verbose'] = true;
      }
    }
    return result;
  };

  exports.checkConfig = function(config) {
    var _ref;
    if ((_ref = config.server) === '127.0.0.1' || _ref === 'localhost') {
      exports.warn("Server is set to " + config.server + ", maybe it's not correct");
      exports.warn("Notice server will listen at " + config.server + ":" + config.server_port);
    }
    if ((config.method || '').toLowerCase() === 'rc4') {
      return exports.warn('RC4 is not safe; please use a safer cipher, like AES-256-CFB');
    }
  };

  exports.version = "socks5 proxy 1.0";

  exports.EVERYTHING = 0;

  exports.DEBUG = 1;

  exports.INFO = 2;

  exports.WARN = 3;

  exports.ERROR = 4;

  _logging_level = exports.INFO;

  exports.config = function(level) {
    return _logging_level = level;
  };

  exports.log = function(level, msg) {
    if (level >= _logging_level) {
      return util.log(msg);
    }
  };

  exports.debug = function(msg) {
    return exports.log(exports.DEBUG, msg);
  };

  exports.info = function(msg) {
    return exports.log(exports.INFO, msg);
  };

  exports.warn = function(msg) {
    return exports.log(exports.WARN, msg);
  };

  exports.error = function(msg) {
    return exports.log(exports.ERROR, msg);
  };

  setInterval(function() {
    if (global.gc) {
      exports.debug('GC');
      return gc();
    }
  }, 30000);

}).call(this);
