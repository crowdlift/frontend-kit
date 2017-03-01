import HtmlWebpackPlugin from 'html-webpack-plugin';
import { cloneDeep } from '../lib/utils';

const setup = (config, webpackConfig) => {
  const clone = cloneDeep(webpackConfig);
  clone.entry = {};
  const minify = config.ENV_PRODUCTION ? { minifyCSS: true, minifyJS: true } : false;
  const htmlConfig = {
    inject: config.html.inject,
    favicon: config.favicon,
    minify,
    hash: false,
    cache: !config.ENV_PRODUCTION,
    showErrors: !config.ENV_PRODUCTION,
    chunkSortMode: 'dependency',
    xhtml: false,
    config: {},
  };

  // Setup webpack to bundle each page
  Object.keys(config.pages).forEach((key) => {
    const page = config.pages[key];
    let chunks = [];
    if (page.js) {
      const keyName = page.js.replace(/\.js$/, '').replace(/[/.]/g, '-');
      chunks = config.ENV_PRODUCTION ? ['vendor', keyName] : [keyName];
      clone.entry[keyName] = [`./src/js/${page.js}`];
    }
    clone.plugins.push(
      new HtmlWebpackPlugin({
        ...htmlConfig,
        filename: page.url,
        template: `./src/html/${page.html}`,
        chunks,
        config: page.config,
      }),
    );
  });
  return clone;
};

export default setup;
export {
  setup,
};
