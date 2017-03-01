require('babel-register');

import rules from './rules';
import resolve from './resolve';
import plugins from './plugins';
import setupPages from './pages';
import { cloneDeep } from '../lib/utils';


// DEVELOPMENT OVERRIDES
const configDevelopment = (config, webpackConfig) => {
  const clone = cloneDeep(webpackConfig);
  clone.output.publicPath = `http://${config.HOST}:${config.PORT}/`;
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
      warnings: true,
    },
  };
  return clone;
};

// PRODUCTION OVERRIDES
const configProduction = (config, webpackConfig) => {
  const clone = cloneDeep(webpackConfig);
  clone.devtool = 'source-map';
  clone.externals = config.externals;
  clone.entry.vendor = config.entry.vendor;
  clone.nfig.output.filename = 'js/[name].[chunkhash].min.js';
  return clone;
};

// TESTING OVERRIDES
const configTesting = (config, webpackConfig) => {
  const clone = configProduction(config, webpackConfig);
  clone.devtool = false;
  return clone;
};

// Return valid webpack config object
const setup = (config) => {
  let webpackConfig = {
    module: {
      rules: rules(config),
    },
    plugins: plugins(config),
    resolve: resolve(config),
    entry: {},
    output: {
      filename: '[name].js',
      path: config.dir.build,
      publicPath: '/',
    },
  };
  webpackConfig = setupPages(config, webpackConfig);

  let confFunc;
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


export default setup;
export {
  setup,
};
