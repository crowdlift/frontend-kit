'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var getImages = function getImages() {
  return [{
    test: /\.(svg|png|jpg|jpeg|gif)(\?.*)?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: 'images/[name]-[hash].[ext]'
      }
    }]
  }];
};

exports.default = getImages;