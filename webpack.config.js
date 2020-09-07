const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Pick one here
const template = 'public/index.html'

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build/stars.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?limit=1000&name=[name].[ext]',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, template),
    }),
  ],
}
