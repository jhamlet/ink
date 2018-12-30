'use strict';

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  only: [ 'src' ],
  ignore: [
    'node_modules'
  ]
};

