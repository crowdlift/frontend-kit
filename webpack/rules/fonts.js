
const getFonts = () =>
  [
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
  ];


export default getFonts;
