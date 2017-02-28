const postCssImport = require('postcss-import');
// cssnext includes autoprefixer
const postCssNext = require('postcss-cssnext');
const postCssFlexbugs = require('postcss-flexbugs-fixes');

module.exports = {
  plugins: [
    postCssImport,
    postCssNext,
    postCssFlexbugs,
  ],
};
