const path = require('path');
const outputPath = path.resolve(__dirname, 'public');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.ts',
    vendor: ['phaser'],
  },
  output: {
    path: outputPath,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src/'),
        exclude: '/node_modules/',
        use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/assets/', to: 'assets/' }],
    }),
  ],
  //開発用サーバを立てるときの設定
  devServer: {
    contentBase: outputPath,
    port: 3000,
    open: true,
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },
};
