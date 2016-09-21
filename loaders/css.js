const isProduction = process.env.NODE_ENV === 'production';

const cssLoader = [
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
  module.exports = ExtractTextPlugin.extract(cssLoader);
} else {
  cssLoader.unshift('style');
  module.exports = cssLoader;
}
