'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _utils = require('../lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setup = function setup(config, webpackConfig) {
  var clone = (0, _utils.cloneDeep)(webpackConfig);
  clone.entry = {};
  var minify = config.ENV_PRODUCTION ? { minifyCSS: true, minifyJS: true } : false;
  var htmlConfig = {
    inject: config.html.inject,
    favicon: config.favicon,
    minify: minify,
    hash: false,
    cache: !config.ENV_PRODUCTION,
    showErrors: !config.ENV_PRODUCTION,
    chunkSortMode: 'dependency',
    xhtml: false,
    config: {}
  };

  // Setup webpack to bundle each page
  Object.keys(config.pages).forEach(function (key) {
    var page = config.pages[key];
    var chunks = [];
    if (page.js) {
      var keyName = page.js.replace(/\.js$/, '').replace(/[/.]/g, '-');
      chunks = config.ENV_PRODUCTION ? ['vendor', keyName] : [keyName];
      clone.entry[keyName] = ['./src/js/' + page.js];
    }
    clone.plugins.push(new _htmlWebpackPlugin2.default(_extends({}, htmlConfig, {
      filename: page.url,
      template: './src/html/' + page.html,
      chunks: chunks,
      config: page.config
    })));
  });
  return clone;
};

exports.default = setup;
exports.setup = setup;