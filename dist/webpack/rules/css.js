'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var getCss = function getCss(config) {
  var cssLoaders = [{ loader: 'style-loader' }, {
    loader: 'css-loader',
    options: {
      sourceMap: config.ENV_DEVELOPMENT,
      // modules: true,
      // import: true,
      importLoaders: 1
    }
  }, {
    // See postcss.config.js for postcss plugins
    loader: 'postcss-loader',
    options: {
      sourceMap: config.ENV_DEVELOPMENT ? 'inline' : false
    }
  }];
  return [{
    test: /\.css$/,
    use: cssLoaders
  }];
};

exports.default = getCss;