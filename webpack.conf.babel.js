const _ = require('lodash');
const webpack = require('webpack');
const path = require('path');
const WebpackMd5Hash = require('webpack-md5-hash');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


// =========================================================
// ENVIRONMENT VARS
// =========================================================
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = (NODE_ENV === 'development');
const ENV_PRODUCTION = (NODE_ENV === 'production');
const ENV_TEST = (NODE_ENV === 'test');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const BUILD_DIR = process.env.BUILD_DIR || './dist';

const projectConfig = require('./config');


// Setup external modules for production
// Each external module needs to be manually included with a <script> tag
const externals = Object.keys(projectConfig.externals).reduce((res, item) =>
  ({ [item]: projectConfig.externals[item].name, ...res })
, {});

// Setup variables to be injected into JavaScript via the DefinePlugin
// Only the variable values are injected, making it easy for UglifyJS to prune code paths
const deepJsonStringify = definitions =>
  _.each(definitions, (val, key) => {
    // eslint-disable-next-line no-param-reassign
    definitions[key] = _.isString(val) ?
      JSON.stringify(val) :
      deepJsonStringify(definitions[key]);
  });
const defineConfig = {
  NODE_ENV: JSON.stringify(NODE_ENV),
  DEBUG: undefined,
};
Object.keys(projectConfig.frontend).forEach((key) => {
  defineConfig[key] = deepJsonStringify(projectConfig.frontend[key]);
});


// =========================================================
// CSS
// =========================================================
const cssLoaders = [
  { loader: 'style-loader' },
  {
    loader: 'css-loader',
    options: {
      sourceMap: ENV_DEVELOPMENT,
      // modules: true,
      // import: true,
      importLoaders: 1,
    },
  },
  {
    // See postcss.config.js for postcss plugins
    loader: 'postcss-loader',
    options: {
      sourceMap: ENV_DEVELOPMENT ? 'inline' : false,
    },
  },
];
const sassLoaderOptions = {
  sourceMap: ENV_DEVELOPMENT,
  includePaths: [path.resolve(__dirname, './src/css')],
};
const sassLoaders = cssLoaders.concat([{
  loader: 'sass-loader',
  options: sassLoaderOptions,
}]);
const extractSass = new ExtractTextPlugin({
  filename: 'css/[name].[contenthash].css',
  disable: ENV_DEVELOPMENT,
});
const extractSassLoader = extractSass.extract({
  fallbackLoader: 'style-loader',
  loader: [
    // Use cssLoaders without style-loader
    ...cssLoaders.slice(1),
    {
      loader: 'sass-loader',
      options: {
        ...sassLoaderOptions,
        outputStyle: 'compressed',
        precision: 10,
        sourceComments: false,
      },
    },
  ],
});

// =========================================================
// RULES
// =========================================================
const rules = [
  // Pug
  {
    test: /\.pug|\.jade$/,
    exclude: /node_modules/,
    use: ['pug-loader'],
  },

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
    use: ['babel-loader'],
  },

  // CSS
  {
    test: /\.css$/,
    use: cssLoaders,
  },

  // SASS
  {
    test: /\.scss$/,
    // Note: using 'loader' vs 'use' so extractSassLoader works without 'unexpected character' error
    loader: ENV_DEVELOPMENT ? sassLoaders : extractSassLoader,
  },


  // WOFF Fonts
  // Load as embedded data if under the size limit, otherwise external file
  {
    test: /\.woff(2)?(\?.*)?$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000,
        minetype: 'application/font-woff',
        name: 'fonts/[name]-[hash].[ext]',
      },
    }],
  },

  // TTF Fonts
  {
    test: /\.(ttf|eot)(\?.*)?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: 'fonts/[name]-[hash].[ext]',
      },
    }],
  },

  // Images
  {
    test: /\.(svg|png|jpg|jpeg|gif)(\?.*)?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: 'images/[name]-[hash].[ext]',
      },
    }],
  },
];


// =========================================================
// CONFIG
// =========================================================
const config = {
  module: {
    rules,
  },
};

// From https://github.com/reactjs/react-router/blob/master/webpack.config.js
// Not sure why?
// config.node = {
//   Buffer: false,
// };

config.resolve = {
  extensions: ['.js', '.json'],
  modules: [
    path.resolve(__dirname, 'vendor'),
    'node_modules',
  ],
  enforceExtension: false,
  enforceModuleExtension: false,
  unsafeCache: false,
  symlinks: true,
  // alias: {
  //   jQuery: path.resolve(__dirname, 'node_modules/jquery/'),
  // },
};

config.plugins = [
  new webpack.DefinePlugin({
    'process.env': defineConfig,
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    // 'window.Tether': 'tether',
  }),
  new webpack.NamedModulesPlugin(),
];

const htmlConfig = {
  // title: '',
  // filename: page.url,
  // template: `./src/html/${page.html}`,
  inject: projectConfig.webpack.html.inject,
  favicon: projectConfig.site.favicon,
  minify: ENV_PRODUCTION ? { minifyCSS: true, minifyJS: true } : false,
  hash: false,
  cache: !ENV_PRODUCTION,
  showErrors: !ENV_PRODUCTION,
  // chunks: { head: { entry: ... }},
  chunkSortMode: 'dependency',
  // excludeChunks: [ 'dev-helper' ],
  xhtml: false,
  config: {},
};


// =====================================
// DEVELOPMENT or PRODUCTION
// =====================================
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  config.entry = {};

  // Setup webpack to bundle each page
  Object.keys(projectConfig.pages).forEach((key) => {
    const page = projectConfig.pages[key];
    let chunks = [];
    if (page.js) {
      const keyName = page.js.replace(/\.js$/, '').replace(/[/.]/g, '-');
      chunks = ENV_PRODUCTION ? ['vendor', keyName] : [keyName];
      config.entry[keyName] = [`./src/js/${page.js}`];
    }
    config.plugins.push(
      // eslint-disable-next-line prefer-object-spread/prefer-object-spread
      new HtmlWebpackPlugin(Object.assign({}, htmlConfig, {
        filename: page.url,
        template: `./src/html/${page.html}`,
        chunks,
        config: page.config,
      })),
    );
  });

  config.output = {
    filename: '[name].js',
    path: path.resolve(BUILD_DIR),
    publicPath: ENV_DEVELOPMENT ? `http://${HOST}:${PORT}/` : '/',
  };
}


// =====================================
// DEVELOPMENT
// =====================================
if (ENV_DEVELOPMENT) {
  config.devtool = 'cheap-source-map';

  // Object.keys(config.entry).forEach((key) => {
  //   config.entry[key].unshift(
  //     `webpack-dev-server/client?http://${HOST}:${PORT}`,
  //     'webpack/hot/only-dev-server'
  //     // 'react-hot-loader/patch',
  //     // 'babel-polyfill'
  //   );
  // });

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),
  );

  config.devServer = {
    contentBase: './src',
    historyApiFallback: true,
    host: HOST,
    hot: true,
    inline: true,
    port: PORT,
    publicPath: config.output.publicPath,
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
      warnings: true,
    },
  };
}


// =====================================
// PRODUCTION
// =====================================
if (ENV_PRODUCTION) {
  config.externals = externals;

  config.devtool = 'source-map';

  config.entry.vendor = ['babel-polyfill', './src/js/lib/vendor.js'];

  config.output.filename = 'js/[name].[chunkhash].min.js';

  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new WebpackMd5Hash(),
    extractSass,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({
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
        screw_ie8: !projectConfig.site.ie8,
        sequences: true,
        unused: true,
        warnings: false,
        // drop_console: true,
      },
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CopyWebpackPlugin(projectConfig.static.copy, projectConfig.static.ignore),
  );
}


// =====================================
// TEST
// =====================================
if (ENV_TEST) {
  config.devtool = false;
  config.externals = externals;
}


module.exports = config;
