const path = require('path');


module.exports = {
    entry: './index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    externals: {
        puppeteer: 'require("puppeteer")'
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, './'),
    },
    target: 'node'
  };