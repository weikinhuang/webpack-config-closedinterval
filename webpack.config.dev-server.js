/* eslint no-sync: off */
const fs = require('fs');
const path = require('path');
const WebpackSubresourceIntegrity = require('webpack-subresource-integrity');
const webpackConfig = require('./webpack.config');

// domain name for localhost
const DEV_DOMAIN = process.env.DEV_DOMAIN || 'localhost.photo-gallery.lan';

// tell babel to process hot reload instrumentation
process.env.BABEL_ENV = 'development';

// output the correct path for html-webpack-plugin for hot reload
webpackConfig.output.publicPath = `https://${DEV_DOMAIN}/`;

// remove subresource integrity plugin
webpackConfig.plugins = webpackConfig.plugins.filter(function(plugin) {
  return !(plugin instanceof WebpackSubresourceIntegrity);
});

// dev server qconfig
webpackConfig.devServer = {
  hot: true,
  https: true,
  host: DEV_DOMAIN,
  port: 443,
  cacert: fs.readFileSync(path.resolve('../docker/certs/ca.crt'), 'utf8'),
  cert: fs.readFileSync(path.resolve('../docker/certs/STAR.photo-gallery.lan.crt'), 'utf8'),
  key: fs.readFileSync(path.resolve('../docker/certs/STAR.photo-gallery.lan.key'), 'utf8'),
  noInfo: true,
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: false,
    publicPath: false
  }
};

module.exports = webpackConfig;
