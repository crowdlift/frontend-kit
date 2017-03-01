'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = undefined;

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

var _resolve = require('./resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _pages = require('./pages');

var _pages2 = _interopRequireDefault(_pages);

var _utils = require('../lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register');

// DEVELOPMENT OVERRIDES
var configDevelopment = function configDevelopment(config, webpackConfig) {
  var clone = (0, _utils.cloneDeep)(webpackConfig);
  clone.output.publicPath = 'http://' + config.HOST + ':' + config.PORT + '/';
  clone.devtool = 'cheap-source-map';
  clone.devServer = {
    contentBase: config.dir.contentBase,
    historyApiFallback: true,
    host: config.HOST,
    hot: true,
    inline: true,
    port: config.PORT,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      assets: true,
      cached: true,
      cachedAssets: true,
      children: false,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false,
      warnings: true
    }
  };
  return clone;
};

// PRODUCTION OVERRIDES
var configProduction = function configProduction(config, webpackConfig) {
  var clone = (0, _utils.cloneDeep)(webpackConfig);
  clone.devtool = 'source-map';
  clone.externals = config.externals;
  clone.entry.vendor = config.entry.vendor;
  clone.nfig.output.filename = 'js/[name].[chunkhash].min.js';
  return clone;
};

// TESTING OVERRIDES
var configTesting = function configTesting(config, webpackConfig) {
  var clone = configProduction(config, webpackConfig);
  clone.devtool = false;
  return clone;
};

// Return valid webpack config object
var setup = function setup(config) {
  var webpackConfig = {
    module: {
      rules: (0, _rules2.default)(config)
    },
    plugins: (0, _plugins2.default)(config),
    resolve: (0, _resolve2.default)(config),
    entry: {},
    output: {
      filename: '[name].js',
      path: config.dir.build,
      publicPath: '/'
    }
  };
  webpackConfig = (0, _pages2.default)(config, webpackConfig);

  var confFunc = void 0;
  switch (config.NODE_ENV) {
    case 'development':
      confFunc = configDevelopment;
      break;
    case 'testing':
      confFunc = configTesting;
      break;
    case 'production':
      confFunc = configProduction;
      break;
    default:
      throw Error('Unrecognized ENV: ', config.ENV);
  }
  webpackConfig = confFunc(config, webpackConfig);

  return webpackConfig;
};

exports.default = setup;
exports.setup = setup;