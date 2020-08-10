'use strict';

const BaseConfig = require('./base.js');

const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');

module.exports = WebpackMerge(
  BaseConfig,
  {
    devtool: 'source-map',
    devServer: {
      inline: true,
      proxy: {
        "/api": {
          target: "http://localhost:4000",
        },
      },
    },
    mode: 'development',
    plugins: [
      new Webpack.HotModuleReplacementPlugin(),
      new Webpack.NamedModulesPlugin(),
    ]
  }
);
