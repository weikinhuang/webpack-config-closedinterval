const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackSubresourceIntegrity = require('webpack-subresource-integrity');
const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin').UnusedFilesWebpackPlugin;
const postcssAdvancedVariables = require('postcss-advanced-variables');
const postcssNested = require('postcss-nested');
const postcssAtRoot = require('postcss-atroot');
const postcssCssnext = require('postcss-cssnext');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
const isProduction = process.env.NODE_ENV === 'production';

// for babel specific configurations
process.env.BABEL_ENV = process.env.NODE_ENV;

// generalized set of default loader configurations
const loaders = require('./loaders');

// setup webpack plugins
const plugins = [
  new webpack.EnvironmentPlugin([
    'NODE_ENV'
  ]),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(process.cwd(), 'app/index.html'),
    inject: true,
    hash: true,
    xhtml: true,
    minify: {}
  }),
  new webpack.optimize.CommonsChunkPlugin({
    children: true,
    minChunks: 3
  }),
  new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
  new WebpackSubresourceIntegrity(['sha256']),
  new FaviconsWebpackPlugin('./app/favicon.png'),
  new UnusedFilesWebpackPlugin({
    failOnUnused: false,
    globOptions: {
      cwd: path.join(process.cwd(), 'app')
    }
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: function() {
        return [
          postcssAdvancedVariables,
          postcssAtRoot,
          postcssNested,
          postcssCssnext,
        ];
      }
    }
  })
];

var cssLoader = [
  'style',
  {
    loader: 'css',
    query: {
      minimize: isProduction,
      sourceMap: !isProduction,
      context: '/',
      camelCase: true
    }
  },
  'postcss'
];

if (isProduction) {
  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }));
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }));

  // extract css into separate files
  plugins.push(new ExtractTextPlugin({ filename: '[name].[hash].css' }));
  cssLoader = ExtractTextPlugin.extract(cssLoader.filter((loader) => (loader.loader || loader) !== 'style'));
}


module.exports = {
  devtool: !isProduction ? 'cheap-module-eval-source-map' : false,
  entry: {
    index: './app/index.js',
    vendor: [
      'babel-polyfill',
      'whatwg-fetch',
      'react',
      'react-dom',
    ]
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve('public'),
    crossOriginLoading: 'anonymous',
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    modules: [
      path.resolve('app', 'js'),
      'node_modules'
    ],
    alias: {
      // local
      img: path.resolve('app/img'),
      styles: path.resolve('app/styles'),
      templates: path.resolve('app/templates')
    },
    extensions: ['.js', '.jsx', '.json', '.css', '.scss']
  },
  resolveLoader: {
    alias: {
      text$: 'raw'
    }
  },
  module: {
    rules: loaders
  },
  plugins: plugins
};
