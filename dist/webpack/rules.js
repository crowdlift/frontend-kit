'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _css = require('./rules/css');

var _css2 = _interopRequireDefault(_css);

var _fonts = require('./rules/fonts');

var _fonts2 = _interopRequireDefault(_fonts);

var _images = require('./rules/images');

var _images2 = _interopRequireDefault(_images);

var _pug = require('./rules/pug');

var _pug2 = _interopRequireDefault(_pug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getRules = function getRules(config) {
  var rules = [
  // For hot reloading html
  // See https://github.com/AriaFallah/WebpackTutorial/tree/master/part1/html-reload
  // {
  //   test: /\.html$/,
  //   use: ['raw-loader'],
  // },

  // JavaScript
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: ['babel-loader']
  }];

  rules.concat((0, _css2.default)(config), (0, _fonts2.default)(config), (0, _images2.default)(config), (0, _pug2.default)(config));
  return rules;
};

exports.default = getRules;