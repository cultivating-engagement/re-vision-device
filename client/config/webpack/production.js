'use strict';

const BaseConfig = require('./base.js');

const WebpackMerge = require('webpack-merge');

module.exports = WebpackMerge(
  BaseConfig,
  {
    mode: 'production',
  }
);
