
const getPug = () =>
  [{
    test: /\.pug|\.jade$/,
    exclude: /node_modules/,
    use: ['pug-loader'],
  }];

export default getPug;
