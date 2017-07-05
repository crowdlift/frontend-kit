import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';

import { cloneDeep, jsonStringifyDeep } from '../lib/utils';


// Dev
const getDevelopment = () =>
  [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // new webpack.NoErrorsPlugin(),
  ];


const getProduction = (config) => {
  const plugins = [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new WebpackMd5Hash(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
  ];
  if (config.moduleConcatenation) {
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  }
  return plugins.concat([
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
        screw_ie8: !config.project.site.ie8,
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
    new CopyWebpackPlugin(config.static.copy, config.static.ignore),
  ]);
};


const getDefine = (config) => {
  const defineConfig = jsonStringifyDeep(cloneDeep(config.define));
  return new webpack.DefinePlugin({
    'process.env': defineConfig,
  });
};


const setup = (config) => {
  const plugins = [
    new webpack.ProvidePlugin(config.provide),
    getDefine(config),
  ];
  let envPlugins;
  switch (config.NODE_ENV) {
    case 'development':
      envPlugins = getDevelopment;
      break;
    case 'testing':
    case 'production':
      envPlugins = getProduction;
      break;
    default:
      throw Error('Unrecognized ENV: ', config.ENV);
  }
  return plugins.concat(envPlugins(config));
};


export default setup;
export {
  setup,
};
