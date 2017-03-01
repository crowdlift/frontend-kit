
const getImages = () =>
  [{
    test: /\.(svg|png|jpg|jpeg|gif)(\?.*)?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: 'images/[name]-[hash].[ext]',
      },
    }],
  }];

export default getImages;
