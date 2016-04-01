// Stolen directly from https://github.com/SimonDegraeve/hapi-webpack-plugin
// Then modified to surface the webpackHotMiddleware and webpackDevMiddleware

/**
 * Import dependencies
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _packageJson = require('../package.json');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

/**
 * Define plugin
 */
function register(server, options, next) {
  // Define variables
  var config = {};
  var compiler = undefined;

  // Require config from path
  if (typeof options === 'string') {
    var configPath = _path2['default'].resolve(process.cwd(), options);
    config = require(configPath);
    compiler = new _webpack2['default'](config);
  } else {
    config = options;
    compiler = config.compiler;
  }

  // Create middlewares
  var webpackDevMiddleware = (0, _webpackDevMiddleware2['default'])(compiler, config.assets);
  var webpackHotMiddleware = (0, _webpackHotMiddleware2['default'])(compiler, config.hot);

  // Handle webpackDevMiddleware
  server.ext('onRequest', function (request, reply) {
    var _request$raw = request.raw;
    var req = _request$raw.req;
    var res = _request$raw.res;

    webpackDevMiddleware(req, res, function (error) {
      if (error) {
        return reply(error);
      }
      reply['continue']();
    });
  });

  // Handle webpackHotMiddleware
  server.ext('onRequest', function (request, reply) {
    var _request$raw2 = request.raw;
    var req = _request$raw2.req;
    var res = _request$raw2.res;

    webpackHotMiddleware(req, res, function (error) {
      if (error) {
        return reply(error);
      }
      reply['continue']();
    });
  });

  // Expose compiler
  server.expose({ compiler: compiler, hotMiddleware: webpackHotMiddleware, devMiddleware: webpackDevMiddleware });

  // Done
  return next();
}

/**
 * Define plugin attributes
 */
register.attributes = {
  name: 'webpack',
  version: _packageJson.version
};

/**
 * Export plugin
 */
exports['default'] = register;
module.exports = exports['default'];
