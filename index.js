const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackSubresourceIntegrity = require('webpack-subresource-integrity');
const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin').UnusedFilesWebpackPlugin;
const autoprefixer = require('autoprefixer');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
const isProduction = process.env.NODE_ENV === 'production';

// for babel specific configurations
process.env.BABEL_ENV = process.env.NODE_ENV;

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
  })
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
}

module.exports = {
  devtool: !isProduction ? 'cheap-module-eval-source-map' : null,
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
    filename: '[name].js',
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
    extensions: ['', '.js', '.jsx', '.json', '.css', '.scss']
  },
  resolveLoader: {
    alias: {
      text$: 'raw'
    }
  },
  module: {
    preLoaders: [
      {
        test: /.scss$/i,
        loader: 'import-glob'
      }
    ],
    loaders: [
      {
        test: /\.html$/i,
        loader: 'html'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          {
            loader: 'file',
            query: {
              hash: 'sha512',
              digest: 'hex',
              name: '[name].[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack',
            query: {
              bypassOnDebug: true,
              optimizationLevel: 7,
              interlaced: true
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        loaders: [
          'style',
          {
            loader: 'css',
            query: {
              minimize: isProduction,
              sourceMap: !isProduction
            }
          },
          'postcss'
        ]
      },
      {
        test: /\.scss$/i,
        loaders: [
          'style',
          {
            loader: 'css',
            query: {
              minimize: isProduction,
              sourceMap: !isProduction
            }
          },
          'postcss',
          {
            loader: 'sass',
            query: {
              sourceMap: !isProduction,
              includePaths: [
                path.resolve('app/styles')
              ]
            }
          }
        ]
      },
      {
        test: /\.json$/i,
        loader: 'json'
      },
      {
        test: /\.jsx?$/i,
        exclude: /(?:node_modules)/,
        loader: 'babel'
      },
      {
        // @see https://github.com/webpack/worker-loader
        test: /worker\.js$/i,
        loader: 'worker'
      }
    ]
  },
  postcss: function() {
    return [autoprefixer({ browsers: ['last 2 versions'] })];
  },
  plugins: plugins
};
