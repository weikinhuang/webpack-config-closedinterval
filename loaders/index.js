const htmlLoader = require('./html');
const cssLoader = require('./css');
const imageLoader = require('./image');
const jsonLoader = require('./json');
const javascriptLoader = require('./javascript');
const workerLoader = require('./worker');

module.exports = [
  {
    test: /\.html$/i,
    loader: htmlLoader
  },
  {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loaders: imageLoader
  },
  {
    test: /\.css$/i,
    loaders: cssLoader
  },
  {
    test: /\.json$/i,
    loader: jsonLoader
  },
  {
    test: /\.jsx?$/i,
    exclude: /(?:node_modules)/,
    loader: javascriptLoader
  },
  {
    // @see https://github.com/webpack/worker-loader
    test: /\.worker\.js$/i,
    loader: workerLoader
  }
];
