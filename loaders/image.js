module.exports = [
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
];
