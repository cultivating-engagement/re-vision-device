'use strict';

const Path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: Path.resolve(__dirname, '../../source/index.js'),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../../source'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [[
              '@babel/preset-env',
              {
                targets: {
                  browsers: '> 1%',
                },
              },
            ]],
          }
        }],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: Path.resolve(__dirname, '../../target'),
    publicPath: '',
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{
      test: /\.html$/,
      from: Path.resolve(__dirname, '../../source'),
      to: Path.resolve(__dirname, '../../target'),
    }]),
  ],
  resolve: {
    alias: {
      Components: Path.resolve(__dirname, '../../source/components/'),
      Utilities:  Path.resolve(__dirname, '../../source/utilities/'),
    },
    extensions: [ '*', '.js', '.vue', '.json' ],
  },
};
