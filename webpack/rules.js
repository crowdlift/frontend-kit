import css from './rules/css';
import fonts from './rules/fonts';
import images from './rules/images';
import pug from './rules/pug';


const getRules = (config) => {
  const rules = [
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
  ];

  return rules.concat(
    css(config),
    fonts(config),
    images(config),
    pug(config),
  );
};

export default getRules;
