
const getCss = (config) => {
  const cssLoaders = [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        sourceMap: config.ENV_DEVELOPMENT,
        // modules: true,
        // import: true,
        importLoaders: 1,
      },
    },
    {
      // See postcss.config.js for postcss plugins
      loader: 'postcss-loader',
      options: {
        sourceMap: config.ENV_DEVELOPMENT ? 'inline' : false,
      },
    },
  ];
  return [{
    test: /\.css$/,
    use: cssLoaders,
  }];
};

export default getCss;
