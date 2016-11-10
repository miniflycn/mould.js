module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      },
    ],
  },
  entry: {
    json: './example/json',
    react: './example/react',
    default: './example/default',
    third: './example/third',
    plugin: './example/plugin',
    flux: './example/flux',
  },
  output: {
    path: 'dist',
    publicPath: 'dist',
    filename: '[name].js',
  },
}
