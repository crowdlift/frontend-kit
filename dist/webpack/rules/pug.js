'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var getPug = function getPug() {
  return [{
    test: /\.pug|\.jade$/,
    exclude: /node_modules/,
    use: ['pug-loader']
  }];
};

exports.default = getPug;