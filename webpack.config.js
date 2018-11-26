const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

// JavaScript rule that specifies what to do with .js files
const javascript = {
  test: /\.(js)$/,
  use: [
    {
      loader: 'babel-loader',
      options: { presets: ['env'] } // this is one way of passing options
    }
  ]
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() {
      return [autoprefixer({ browsers: 'last 3 versions' })];
    }
  }
};

// sass/css loader. It handles files that are require('something.scss')
const styles = {
  test: /\.(scss)$/,
  // pass the options as query params b/c it's short
  // don't just pass an array of loaders, run them through the extract plugin so they can be outputted to their own .css file
  use: ExtractTextPlugin.extract([
    'css-loader?sourceMap',
    postcss,
    'sass-loader?sourceMap'
  ])
};

const uglify = new webpack.optimize.UglifyJsPlugin({
  // eslint-disable-line
  compress: { warnings: false }
});

const config = {
  entry: {
    // only have 1 entry, but I've set it up for multiple in the future
    App: './public/javascripts/delicious-app.js'
  },
  // using sourcemaps and here is where we specify which kind
  devtool: 'source-map',
  output: {
    // path is a built in node module
    // __dirname is a variable from node that gives us the
    path: path.resolve(__dirname, 'public', 'dist'),
    // we can use "substitutions" in file names like [name] and [hash]
    // name will be `App` because that is what we used above in our entry
    filename: '[name].bundle.js'
  },

  // pass the rules for JS and styles
  module: {
    rules: [javascript, styles]
  },
  // finally we pass it an array of plugins - uncomment if you want to uglify
  // plugins: [uglify]
  plugins: [
    // here is where we tell it to output our css to a separate file
    new ExtractTextPlugin('style.css')
  ]
};

process.noDeprecation = true;

module.exports = config;
