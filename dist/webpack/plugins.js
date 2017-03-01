'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = undefined;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _compressionWebpackPlugin = require('compression-webpack-plugin');

var _compressionWebpackPlugin2 = _interopRequireDefault(_compressionWebpackPlugin);

var _copyWebpackPlugin = require('copy-webpack-plugin');

var _copyWebpackPlugin2 = _interopRequireDefault(_copyWebpackPlugin);

var _webpackMd5Hash = require('webpack-md5-hash');

var _webpackMd5Hash2 = _interopRequireDefault(_webpackMd5Hash);

var _utils = require('../lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Dev
var getDevelopment = function getDevelopment() {
  return [new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.NamedModulesPlugin()];
};

var getProduction = function getProduction(config) {
  return [new _webpack2.default.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }), new _webpackMd5Hash2.default(), new _webpack2.default.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity
  }), new _webpack2.default.optimize.UglifyJsPlugin({
    // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#usage
    mangle: true,
    sourceMap: true,
    // comments: false,
    compress: {
      // https://github.com/mishoo/UglifyJS2/blob/master/lib/compress.js
      // comparisons: true,
      // conditionals: true,
      dead_code: true,
      drop_debugger: true,
      // evaluate: true,
      // if_return: true,
      join_vars: true,
      screw_ie8: !config.project.site.ie8,
      sequences: true,
      unused: true,
      warnings: false
    }
  }), new _compressionWebpackPlugin2.default({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.html$/,
    threshold: 10240,
    minRatio: 0.8
  }), new _copyWebpackPlugin2.default(config.static.copy, config.static.ignore)];
};

var getDefine = function getDefine(config) {
  var defineConfig = (0, _utils.jsonStringifyDeep)((0, _utils.cloneDeep)(config.define));
  return new _webpack2.default.DefinePlugin({
    'process.env': defineConfig
  });
};

var setup = function setup(config) {
  var plugins = [];
  plugins.concat([new _webpack2.default.ProvidePlugin(config.provide), getDefine(config)]);
  switch (config.NODE_ENV) {
    case 'development':
      plugins.concat(getDevelopment(config));
      break;
    case 'testing':
    case 'production':
      plugins.concat(getProduction(config));
      break;
    default:
      throw Error('Unrecognized ENV: ', config.ENV);
  }
  return plugins;
};

exports.default = setup;
exports.setup = setup;