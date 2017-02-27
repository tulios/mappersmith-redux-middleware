const path = require('path')
const webpack = require('webpack')
const packageJson = require('./package.json')
const env = process.env.NODE_ENV || 'development'
const version = packageJson.version
const link = packageJson.homepage

let plugins = []

const devTool = (env === 'test')
  ? 'inline-source-map'
  : 'source-map'

if (env === 'production') {
  plugins = [
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new webpack.BannerPlugin({
      banner: `/*!\n * Mappersmith Redux Middleware ${version}\n * ${link}\n */`,
      raw: true,
      entryOnly: true
    })
  ]
}

module.exports = {
  context: __dirname,
  resolve: {
    modules: [
      path.join(__dirname, '/node_modules'),
      __dirname,
    ]
  },
  entry: './lib/index.js',
  output: {
    path: 'dist/',
    filename: 'mappersmith-redux-middleware.js',
    sourceMapFilename: 'mappersmith-redux-middleware.map',
    library: 'mappersmith-redux-middleware',
    libraryTarget: 'umd'
  },
  target: 'web',
  node: {
    process: false
  },
  plugins: plugins,
  devtool: devTool,
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
}
