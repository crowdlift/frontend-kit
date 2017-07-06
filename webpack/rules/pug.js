
const getPug = () =>
  [{
    test: /\.pug|\.jade$/,
    exclude: /node_modules(?!(\/|\\)frontendkit-components)/,
    use: ['pug-loader'],
  }];

export default getPug;
